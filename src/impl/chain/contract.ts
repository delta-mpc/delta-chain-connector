import common from "@ethereumjs/common";
import { TransactionFactory } from "@ethereumjs/tx";
import * as fs from "fs/promises";
import log from "~/log";
import { EventEmitter, PassThrough, Readable } from "stream";
import Web3 from "web3";
import { Log, provider, TransactionReceipt } from "web3-core";
import { Contract, EventData } from "web3-eth-contract";
import { AbiItem, sha3 } from "web3-utils";

interface Abi extends AbiItem {
  signature?: string;
}

interface ContractOption {
  contractAddress: string;
  abiFile: string;
  nodeAddress: string;
  privateKey: string;
  provider: string;
  gasPrice: number;
  gasLimit: number;
  chainParam: {
    name?: string;
    chainId?: number;
  };
}

interface gasOption {
  gasPrice?: number;
  gasLimit?: number;
}

type Result = { [key: string]: string };
type Mixed = { [key: string | number]: string | any } | string;

export class ContractHelper {
  private web3!: Web3;
  private abis!: Abi[];
  private contract!: Contract;

  private option: ContractOption;

  private unsubscribeMap: Map<Readable, () => void> = new Map();

  constructor(option: ContractOption) {
    this.option = option;
    log.info(`${option.abiFile}`);
  }

  async init(): Promise<void> {
    const provider = await this.connect(this.option.provider);
    this.web3 = new Web3(provider);

    const content = await fs.readFile(this.option.abiFile, { encoding: "utf-8" });
    const jsonInterface = JSON.parse(content);
    const rawAbis: AbiItem[] = jsonInterface.abi;
    this.abis = rawAbis.map((abi) => {
      if (abi.type === "event") {
        const signature = abi.name + "(" + abi.inputs!.map((input) => input.type).join(",") + ")";
        const hash = sha3(signature);
        return { ...abi, signature: hash || undefined };
      } else {
        return abi;
      }
    });

    this.contract = new this.web3.eth.Contract(this.abis, this.option.contractAddress);
  }

  async connect(url: string): Promise<provider> {
    const provider = new Web3.providers.WebsocketProvider(url, {
      reconnect: {
        auto: true,
        delay: 5000,
        maxAttempts: 5,
        onTimeout: false,
      },
    });
    return new Promise((resolve, reject) => {
      provider.on("connect", () => {
        log.info("Blockchain connected");
        resolve(provider);
      });
      provider.on("error", () => {
        reject();
      });
    });
  }

  async method(
    name: string,
    args: any[] = [],
    nonce: number = 0,
    gasOpt: gasOption | null = null
  ): Promise<TransactionReceipt> {
    const method = this.contract.methods[name](...args);
    const data = method.encodeABI();

    const gasPrice = gasOpt?.gasPrice || this.option.gasPrice;
    const gasLimit = gasOpt?.gasLimit || this.option.gasLimit;

    if (nonce === 0) {
      nonce = await this.web3.eth.getTransactionCount(this.option.nodeAddress);
    }

    const tra = {
      data: data,
      from: this.option.nodeAddress,
      to: this.option.contractAddress,
      gasPrice: "0x" + gasPrice.toString(16),
      gasLimit: "0x" + gasLimit.toString(16),
      nonce: this.web3.utils.toHex(nonce),
    };

    let privateKey = this.option.privateKey;
    if (privateKey.startsWith("0x")) {
      privateKey = privateKey.slice(2);
    }
    const key = Buffer.from(privateKey, "hex");
    const tx = TransactionFactory.fromTxData(tra, {
      common: common.custom(this.option.chainParam),
    });
    const serializedTx = "0x" + tx.sign(key).serialize().toString("hex");
    return new Promise((resolve, reject) => {
      this.web3.eth
        .sendSignedTransaction(serializedTx)
        .then((receipt) => {
          if (receipt.status) {
            resolve(receipt);
          } else {
            const err = `method ${name} tx hash ${receipt.transactionHash} is reverted`;
            reject(err);
          }
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  }

  decodeLogs(logs: Log[]): Result | undefined {
    for (const rlog of logs) {
      const topics = rlog.topics;
      const data = rlog.data;
      for (const abi of this.abis) {
        if (abi.signature && topics.includes(abi.signature) && abi.inputs) {
          const result = this.web3.eth.abi.decodeLog(abi.inputs, data, topics.slice(1));
          result.name = abi.name ? abi.name : result.name;
          return result;
        }
      }
    }
    return undefined;
  }

  async call(name: string, args: any[] = []): Promise<Mixed> {
    const method = this.contract.methods[name](...args);
    const res = await method.call({ from: this.option.nodeAddress });
    return res;
  }

  subscribe(): Readable {
    const stream = new PassThrough({ objectMode: true });
    const callback = (event: EventData) => {
      stream.write(event);
    };

    const emitter: EventEmitter = this.contract.events.allEvents({ fromBlock: "latest" });
    emitter.on("data", callback);

    const unsubscribe = () => {
      emitter.off("data", callback);
    };
    this.unsubscribeMap.set(stream, unsubscribe);

    return stream;
  }

  unsubscribe(stream: Readable): void {
    const unsubscribe = this.unsubscribeMap.get(stream);
    if (unsubscribe) {
      unsubscribe();
    }
  }
}
