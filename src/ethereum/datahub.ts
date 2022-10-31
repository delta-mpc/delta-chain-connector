import path from "path";
import { Readable } from "stream";
import { EventData } from "web3-eth-contract";
import { config } from "~/config";
import { DataRegisteredEvent, Subscriber } from "~/event";
import { DataHubImpl } from "~/impl/datahub";
import { ContractHelper, ContractOption } from "./contract";

class DataHub implements DataHubImpl {
  private subscriber = new Subscriber<DataRegisteredEvent>();
  private option!: ContractOption;
  contract!: ContractHelper;
  private subscribeMap: Map<Readable, Readable> = new Map();

  async init(opt?: ContractOption): Promise<void> {
    this.option = opt || {
      contractAddress: config.ethereum.datahub.contractAddress,
      abiFile: path.resolve(__dirname + "/../contract/DataHub.json"),
      nodeAddress: config.ethereum.nodeAddress,
      privateKey: config.ethereum.privateKey,
      provider: config.ethereum.provider,
      gasPrice: config.ethereum.gasPrice,
      gasLimit: config.ethereum.gasLimit,
      chainParam: config.ethereum.chainParam,
    };
    this.contract = new ContractHelper(this.option);
    await this.contract.init();
  }

  async register(address: string, name: string, index: number, commitment: string): Promise<string> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    const hash = await this.contract.method("register", [name, index, commitment]);
    const receipt = await this.contract.waitForReceipt(hash);
    return receipt.transactionHash;
  }

  async getDataCommitment(address: string, name: string, index: number): Promise<string> {
    const res = await this.contract.call("getDataCommitment", [address, name, index]);
    if (typeof res === "object") {
      throw new Error(`getDataCommitment return type error ${res}`);
    }
    return res;
  }

  subscribe(address: string): Readable {
    const src = this.contract.subscribe();
    src.on("data", (event: EventData) => {
      const res = event.returnValues;
      switch (event.event) {
        case "DataRegistered":
          this.subscriber.publish({
            type: "DataRegistered",
            owner: res.owner,
            name: res.name,
            index: Number(res.index),
            commitment: res.commitment,
          });
          break;
      }
    });
    const res = this.subscriber.subscribe(address);
    this.subscribeMap.set(res, src);
    return res;
  }

  unsubscribe(stream: Readable): void {
    if (this.subscribeMap.has(stream)) {
      this.subscriber.unsubscribe(stream);
      const src = this.subscribeMap.get(stream);
      if (src) {
        this.contract.unsubscribe(src);
      }
    }
  }
}

export const datahub = new DataHub();
