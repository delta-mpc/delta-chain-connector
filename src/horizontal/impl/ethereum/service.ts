import path from "path";
import { Readable } from "stream";
import { EventData } from "web3-eth-contract";
import { config } from "~/config";
import { Subscriber } from "~/event";
import {
  AggregationStartedEvent,
  CalculationStartedEvent,
  PartnerSelectedEvent,
  RoundEndedEvent,
  RoundStartedEvent,
  TaskCreatedEvent,
  TaskFinishedEvent,
} from "../../event";
import { Impl, NodeInfo, NodeInfosPage, SecretShareData, TaskInfo, TaskRoundInfo } from "../impl";
import { ContractHelper } from "./contract";

export interface ContractOption {
  contractAddress: string;
}

export interface ChainOption {
  nodeAddress: string;
  privateKey: string;
  provider: string;
  gasPrice: number;
  gasLimit: number;
  chainParam: {
    name?: string;
    chainId?: number;
  };

  identity: ContractOption;
  hfl: ContractOption;
}

class _Impl implements Impl {
  private subscriber = new Subscriber();

  private option!: ChainOption;
  private identityContract!: ContractHelper;
  private hflContract!: ContractHelper;

  private subscribeMap: Map<Readable, Readable> = new Map();

  async init(opt?: ChainOption): Promise<void> {
    this.option = opt || config.ethereum;

    const identityOption = {
      ...this.option.identity,
      abiFile: path.resolve(__dirname + "/../../../contract/IdentityContract.json"),
      nodeAddress: this.option.nodeAddress,
      privateKey: this.option.privateKey,
      provider: this.option.provider,
      gasPrice: this.option.gasPrice,
      gasLimit: this.option.gasLimit,
      chainParam: this.option.chainParam,
    };
    const hflOption = {
      ...this.option.hfl,
      abiFile: path.resolve(__dirname + "/../../../contract/HFLContract.json"),
      nodeAddress: this.option.nodeAddress,
      privateKey: this.option.privateKey,
      provider: this.option.provider,
      gasPrice: this.option.gasPrice,
      gasLimit: this.option.gasLimit,
      chainParam: this.option.chainParam,
    };
    this.identityContract = new ContractHelper(identityOption);
    this.hflContract = new ContractHelper(hflOption);
    await this.identityContract.init();
    await this.hflContract.init();
  }

  subscribe(address: string, timeout: number): Readable {
    const src = this.hflContract.subscribe();
    src.on("data", (event: EventData) => {
      const res = event.returnValues;
      switch (event.event) {
        case "AggregateStarted":
          this.subscriber.publish({
            type: "AggregationStarted",
            taskID: res.taskId,
            round: Number(res.round),
            addrs: res.addrs,
          } as AggregationStartedEvent);
          break;
        case "CalculateStarted":
          this.subscriber.publish({
            type: "CalculationStarted",
            taskID: res.taskId,
            round: Number(res.round),
            addrs: res.addrs,
          } as CalculationStartedEvent);
          break;
        case "PartnerSelected":
          this.subscriber.publish({
            type: "PartnerSelected",
            taskID: res.taskId,
            round: Number(res.round),
            addrs: res.addrs,
          } as PartnerSelectedEvent);
          break;
        case "RoundEnd":
          this.subscriber.publish({
            type: "RoundEnded",
            taskID: res.taskId,
            round: Number(res.round),
          } as RoundEndedEvent);
          break;
        case "RoundStart":
          this.subscriber.publish({
            type: "RoundStarted",
            taskID: res.taskId,
            round: Number(res.round),
          } as RoundStartedEvent);
          break;
        case "TaskCreated":
          this.subscriber.publish({
            type: "TaskCreated",
            address: res.creator,
            taskID: res.taskId,
            dataset: res.dataSet,
            url: res.creatorUrl,
            commitment: res.commitment,
            taskType: res.taskType,
          } as TaskCreatedEvent);
          break;
        case "TaskFinished":
          this.subscriber.publish({
            type: "TaskFinished",
            taskID: res.taskId,
          } as TaskFinishedEvent);
          break;
      }
    });
    const res = this.subscriber.subscribe(address, timeout);
    this.subscribeMap.set(res, src);
    return res;
  }

  unsubscribe(stream: Readable): void {
    if (this.subscribeMap.has(stream)) {
      this.subscriber.unsubscribe(stream);
      const src = this.subscribeMap.get(stream);
      if (src) {
        this.hflContract.unsubscribe(src);
      }
    }
  }

  async join(url: string, name: string): Promise<[string, string]> {
    const hash = await this.identityContract.method("join", [url, name]);
    const receipt = await this.identityContract.waitForReceipt(hash);
    const res = this.identityContract.decodeLogs(receipt.logs);
    if (!res) {
      throw new Error("join has no result");
    }
    return [receipt.transactionHash, res.addr];
  }

  async updateUrl(address: string, url: string): Promise<string> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }
    const hash = await this.identityContract.method("updateUrl", [url]);
    await this.hflContract.waitForReceipt(hash);
    return hash;
  }

  async updateName(address: string, name: string): Promise<string> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }
    const hash = await this.identityContract.method("updateName", [name]);
    await this.hflContract.waitForReceipt(hash);
    return hash;
  }

  async leave(address: string): Promise<string> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }
    const hash = await this.identityContract.method("leave");
    return hash;
  }

  async getNodeInfo(address: string): Promise<NodeInfo> {
    const res = await this.identityContract.call("getNodeInfo", [address]);
    if (typeof res === "string") {
      throw new Error("getNodeInfo return type error");
    }
    return {
      address: address,
      url: res.url,
      name: res.name,
    };
  }

  async getNodes(page: number, pageSize: number): Promise<NodeInfosPage> {
    const res = await this.identityContract.call("getNodes", [page, pageSize]);
    if (typeof res === "string") {
      throw new Error("getNodeInfo return type error");
    }
    const nodes = res[0].map((node: any) => {
      return {
        address: node.addr,
        url: node.url,
        name: node.name,
      };
    });
    return {
      nodes: nodes,
      totalCount: Number(res[1]),
    };
  }

  async createTask(
    address: string,
    dataset: string,
    commitment: string,
    taskType: string
  ): Promise<[string, string]> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    const hash = await this.hflContract.method("createTask", [dataset, commitment, taskType]);
    const receipt = await this.hflContract.waitForReceipt(hash);
    const res = this.hflContract.decodeLogs(receipt.logs);
    if (!res) {
      throw new Error("createTask has no result");
    }
    return [receipt.transactionHash, res.taskId];
  }

  async finishTask(address: string, taskID: string): Promise<string> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    const hash = await this.hflContract.method("finishTask", [taskID]);
    await this.hflContract.waitForReceipt(hash);
    return hash;
  }

  async getTask(taskID: string): Promise<TaskInfo> {
    const res = await this.hflContract.call("getTask", [taskID]);
    if (typeof res === "string") {
      throw new Error("getTask return type error");
    }

    return {
      address: res.creator,
      taskID: taskID,
      url: res.creatorUrl,
      dataset: res.dataSet,
      commitment: res.commitment,
      taskType: res.taskType,
      finished: Boolean(res.finished),
    };
  }

  async startRound(address: string, taskID: string, round: number): Promise<string> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    const hash = await this.hflContract.method("startRound", [taskID, round, 100, 1]);
    await this.hflContract.waitForReceipt(hash);
    return hash;
  }

  async joinRound(address: string, taskID: string, round: number, pk1: string, pk2: string): Promise<string> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    const hash = await this.hflContract.method("joinRound", [taskID, round, pk1, pk2]);
    await this.hflContract.waitForReceipt(hash);
    return hash;
  }

  async getTaskRound(taskID: string, round: number): Promise<TaskRoundInfo> {
    const res = await this.hflContract.call("getTaskRound", [taskID, round]);
    if (typeof res === "string") {
      throw new Error("getTaskRound return type error");
    }

    return {
      round: Number(res.currentRound),
      status: Number(res.status),
      clients: res.joinedAddrs,
    };
  }

  async selectCandidates(address: string, taskID: string, round: number, clients: string[]): Promise<string> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    const hash = await this.hflContract.method("selectCandidates", [taskID, round, clients]);
    await this.hflContract.waitForReceipt(hash);
    return hash;
  }

  async uploadSeedCommitment(
    address: string,
    taskID: string,
    round: number,
    receivers: string[],
    commitments: string[]
  ): Promise<string> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    const hash = await this.hflContract.method("uploadSeedCommitment", [
      taskID,
      round,
      receivers,
      commitments,
    ]);
    await this.hflContract.waitForReceipt(hash);
    return hash;
  }

  async uploadSecretKeyCommitment(
    address: string,
    taskID: string,
    round: number,
    receivers: string[],
    commitments: string[]
  ): Promise<string> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    const hash = await this.hflContract.method("uploadSecretKeyCommitment", [
      taskID,
      round,
      receivers,
      commitments,
    ]);
    await this.hflContract.waitForReceipt(hash);
    return hash;
  }

  async getClientPublickKeys(taskID: string, round: number, clients: string[]): Promise<[string, string][]> {
    const res = await this.hflContract.call("getClientPublickeys", [taskID, round, clients]);
    if (typeof res === "string") {
      throw new Error("getClientPublickeys return type error");
    }

    return res.map((item: any) => [item.pk1, item.pk2]);
  }

  async startCalculation(address: string, taskID: string, round: number, clients: string[]): Promise<string> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    const hash = await this.hflContract.method("startCalculate", [taskID, round, clients]);
    await this.hflContract.waitForReceipt(hash);
    return hash;
  }

  async uploadResultCommitment(
    address: string,
    taskID: string,
    round: number,
    commitment: string
  ): Promise<string> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    const hash = await this.hflContract.method("uploadResultCommitment", [taskID, round, commitment]);
    await this.hflContract.waitForReceipt(hash);
    return hash;
  }

  async getResultCommitment(taskID: string, round: number, client: string): Promise<string> {
    const res = await this.hflContract.call("getResultCommitment", [taskID, client, round]);
    if (typeof res === "object") {
      throw new Error("getClientPublickeys return type error");
    }

    return res;
  }

  async startAggregation(address: string, taskID: string, round: number, clients: string[]): Promise<string> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    const hash = await this.hflContract.method("startAggregate", [taskID, round, clients]);
    await this.hflContract.waitForReceipt(hash);
    return hash;
  }

  async uploadSeed(
    address: string,
    taskID: string,
    round: number,
    senders: string[],
    seeds: string[]
  ): Promise<string> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    const hash = await this.hflContract.method("uploadSeed", [taskID, round, senders, seeds]);
    await this.hflContract.waitForReceipt(hash);
    return hash;
  }

  async uploadSecretKey(
    address: string,
    taskID: string,
    round: number,
    senders: string[],
    secretKeys: string[]
  ): Promise<string> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    const hash = await this.hflContract.method("uploadSecretkeyMask", [taskID, round, senders, secretKeys]);
    await this.hflContract.waitForReceipt(hash);
    return hash;
  }

  async getSecretShareDatas(
    taskID: string,
    round: number,
    senders: string[],
    receiver: string
  ): Promise<SecretShareData[]> {
    const res = await this.hflContract.call("getSecretSharingDatas", [taskID, round, senders, receiver]);
    if (typeof res === "string") {
      throw new Error("getSecretShareDatas return type error");
    }

    return res.map((item: any) => {
      return {
        seed: item.seedPiece,
        seedCommitment: item.seedCommitment,
        secretKey: item.secretKeyPiece,
        secretKeyCommitment: item.secretKeyMaskCommitment,
      };
    });
  }

  async endRound(address: string, taskID: string, round: number): Promise<string> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    const hash = await this.hflContract.method("endRound", [taskID, round]);
    await this.hflContract.waitForReceipt(hash);
    return hash;
  }
}

export const impl = new _Impl();
