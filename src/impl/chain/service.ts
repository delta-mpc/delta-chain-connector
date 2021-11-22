import common from "@ethereumjs/common";
import { TransactionFactory } from "@ethereumjs/tx";
import * as fs from "fs/promises";
import { config } from "src/config";
import log from "src/log";
import { Readable } from "stream";
import Web3 from "web3";
import { sha3 } from "web3-utils";
import { Log, provider } from "web3-core";
import { TransactionReceipt } from "web3-eth";
import { Contract, EventData } from "web3-eth-contract";
import { AbiItem } from "web3-utils";
import { Event, Subscriber } from "..";
import { Impl, NodeInfo, SecretShareData, TaskRoundInfo } from "../service";

export interface ImplOption {
  contractAddress: string;
  nodeAddress: string;
  privateKey: string;
  provider: string;
  abiFile: string;
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

interface Abi extends AbiItem {
  signature?: string;
}

type Mixed = { [key: string | number]: string | any } | string;

class _Impl implements Impl {
  private subscriber = new Subscriber();

  private option!: ImplOption;
  private web3: Web3 = new Web3();
  private contract!: Contract;
  private abis: Abi[] = [];
  private serverUrl = "127.0.0.1:6800";

  async init(opt?: ImplOption): Promise<void> {
    this.option = opt || config.chain;
    if (this.option.privateKey.startsWith("0x")) {
      this.option.privateKey = this.option.privateKey.slice(2);
    }
    const provider = await this.connect(this.option.provider);
    this.web3.setProvider(provider);
    const file = await fs.readFile(this.option.abiFile, { encoding: "utf-8" });
    const jsonInterface = JSON.parse(file);
    const abis: AbiItem[] = jsonInterface.abi;
    for (const abi of abis) {
      if (abi.type === "event") {
        const signature = abi.name + "(" + abi.inputs!.map((input) => input.type).join(",") + ")";
        const hash = sha3(signature);
        this.abis.push({ ...abi, signature: hash || undefined });
      } else {
        this.abis.push(abi);
      }
    }
    this.contract = new this.web3.eth.Contract(this.abis, this.option.contractAddress);
    this.listenEvents();
  }

  listenEvents(): void {
    this.contract.events.allEvents({ fromBlock: "latest" }).on("data", (event: EventData) => {
      const res = event.returnValues;
      let retEvent: Event;
      switch (event.event) {
        case "AggregateStarted":
          retEvent = {
            type: "AggregationStarted",
            taskID: res.taskId,
            round: Number(res.round),
            addrs: res.addrs,
          };
          this.subscriber.publish(retEvent);
          break;
        case "CalculateStarted":
          retEvent = {
            type: "CalculationStarted",
            taskID: res.taskId,
            round: Number(res.round),
            addrs: res.addrs,
          };
          this.subscriber.publish(retEvent);
          break;
        case "PartnerSelected":
          retEvent = {
            type: "PartnerSelected",
            taskID: res.taskId,
            round: Number(res.round),
            addrs: res.addrs,
          };
          this.subscriber.publish(retEvent);
          break;
        case "RoundEnd":
          retEvent = {
            type: "RoundEnded",
            taskID: res.taskId,
            round: Number(res.round),
          };
          this.subscriber.publish(retEvent);
          break;
        case "RoundStart":
          retEvent = {
            type: "RoundStarted",
            taskID: res.taskId,
            round: Number(res.round),
          };
          this.subscriber.publish(retEvent);
          break;
        case "TaskCreated":
          retEvent = {
            type: "TaskCreated",
            address: res.creator,
            taskID: res.taskId,
            dataset: res.dataSet,
            url: res.creatorUrl,
            commitment: res.commitment,
          };
          this.subscriber.publish(retEvent);
          break;
      }
    });
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

    const key = Buffer.from(this.option.privateKey, "hex");
    const tx = TransactionFactory.fromTxData(tra, {
      common: common.custom(this.option.chainParam),
    });
    const serializedTx = "0x" + tx.sign(key).serialize().toString("hex");
    return new Promise((resolve, reject) => {
      this.web3.eth
        .sendSignedTransaction(serializedTx, (err, txHash) => {
          if (err) {
            log.error(err);
            reject(err);
          } else {
            log.info(`method ${name} tx hash ${txHash}`);
          }
        })
        .then((receipt) => {
          if (receipt.status) {
            resolve(receipt);
          } else {
            const err = `method ${name} tx hash ${receipt.transactionHash} is reverted`;
            reject(err);
          }
        });
    });
  }

  decodeLogs(logs: Log[]) {
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

  async join(url: string, name: string): Promise<string> {
    const recepit = await this.method("join", [url, name]);
    const res = this.decodeLogs(recepit.logs);
    if (!res) {
      throw new Error("join has no result");
    }
    return res.address;
  }

  async updateUrl(address: string, url: string): Promise<void> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }
    await this.method("updateUrl", [url]);
  }

  async updateName(address: string, name: string): Promise<void> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }
    await this.method("updateName", [name]);
  }

  async leave(address: string): Promise<void> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }
    await this.method("leave");
  }

  async getNodeInfo(address: string): Promise<NodeInfo> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    const res = await this.call("getNodeInfo");
    if (typeof res === "string") {
      throw new Error("getNodeInfo return type error");
    }
    return {
      url: res.url,
      name: res.name,
    };
  }

  async createTask(address: string, dataset: string, commitment: string): Promise<string> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    const receipt = await this.method("createTask", [this.serverUrl, dataset, commitment]);
    const res = this.decodeLogs(receipt.logs);
    if (!res) {
      throw new Error("createTask has no result");
    }
    return res.taskId;
  }

  async startRound(address: string, taskID: string, round: number): Promise<void> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    await this.method("startRound", [taskID, round, 100, 1]);
  }

  async joinRound(address: string, taskID: string, round: number, pk1: string, pk2: string): Promise<void> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    await this.method("joinRound", [taskID, round, pk1, pk2]);
  }

  async getTaskRound(taskID: string, round: number): Promise<TaskRoundInfo> {
    const res = await this.call("getTaskRound", [taskID, round]);
    if (typeof res === "string") {
      throw new Error("getTaskRound return type error");
    }

    return {
      round: Number(res.currentRound),
      status: Number(res.status),
      clients: res.joinedAddrs,
    };
  }

  async selectCandidates(address: string, taskID: string, round: number, clients: string[]): Promise<void> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    await this.method("selectCandidates", [taskID, round, clients]);
  }

  async uploadSeedCommitment(
    address: string,
    taskID: string,
    round: number,
    receiver: string,
    commitment: string
  ): Promise<void> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    await this.method("uploadSeedCommitment", [taskID, round, receiver, commitment]);
  }

  async uploadSecretKeyCommitment(
    address: string,
    taskID: string,
    round: number,
    receiver: string,
    commitment: string
  ): Promise<void> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    await this.method("uploadSecretKeyCommitment", [taskID, round, receiver, commitment]);
  }

  async getClientPublickKeys(taskID: string, round: number, client: string): Promise<[string, string]> {
    const res = await this.call("getClientPublickeys", [taskID, round, client]);
    if (typeof res === "string") {
      throw new Error("getClientPublickeys return type error");
    }

    return [res.pk1, res.pk2];
  }

  async startCalculation(address: string, taskID: string, round: number, clients: string[]): Promise<void> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    await this.method("startCalculate", [taskID, round, clients]);
  }

  async uploadResultCommitment(
    address: string,
    taskID: string,
    round: number,
    commitment: string
  ): Promise<void> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    await this.method("uploadResultCommitment", [taskID, round, commitment]);
  }

  async getResultCommitment(taskID: string, round: number, client: string): Promise<string> {
    const res = await this.call("getResultCommitment", [taskID, client, round]);
    if (typeof res === "object") {
      throw new Error("getClientPublickeys return type error");
    }

    return res;
  }

  async startAggregation(address: string, taskID: string, round: number, clients: string[]): Promise<void> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    await this.method("startAggregate", [taskID, round, clients]);
  }

  async uploadSeed(
    address: string,
    taskID: string,
    round: number,
    sender: string,
    seed: string
  ): Promise<void> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    await this.method("uploadSeed", [taskID, round, sender, seed]);
  }

  async uploadSecretKey(
    address: string,
    taskID: string,
    round: number,
    sender: string,
    secretKey: string
  ): Promise<void> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    await this.method("uploadSecretkeyMask", [taskID, round, sender, secretKey]);
  }

  async getSecretShareData(
    taskID: string,
    round: number,
    sender: string,
    receiver: string
  ): Promise<SecretShareData> {
    const res = await this.call("getSecretSharingData", [taskID, round, sender, receiver]);
    if (typeof res === "string") {
      throw new Error("getSecretShareData return type error");
    }

    return {
      seed: res.seedPiece,
      seedCommitment: res.seedCommitment,
      secretKey: res.secretKeyPiece,
      secretKeyCommitment: res.secretKeyMaskCommitment,
    };
  }

  async endRound(address: string, taskID: string, round: number): Promise<void> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    await this.method("endRound", [taskID, round]);
  }

  subscribe(): Readable {
    return this.subscriber.subscribe();
  }

  unsubscribe(stream: Readable): void {
    this.subscriber.unsubscribe(stream);
  }
}

export const impl = new _Impl();
