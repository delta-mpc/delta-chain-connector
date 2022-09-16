import path from "path";
import { Readable } from "stream";
import { EventData } from "web3-eth-contract";
import { config } from "~/config";
import * as entity from "~/entity/horizontal";
import { HorizontalEvent, Subscriber } from "~/event";
import { HorizontalImpl } from "~/impl/horizontal";
import { ContractHelper, ContractOption } from "./contract";

class Horizontal implements HorizontalImpl {
  private subscriber = new Subscriber<HorizontalEvent>();

  private option!: ContractOption;
  contract!: ContractHelper;

  private subscribeMap: Map<Readable, Readable> = new Map();

  async init(opt?: ContractOption): Promise<void> {
    this.option = opt || {
      contractAddress: config.ethereum.hfl.contractAddress,
      abiFile: path.resolve(__dirname + "/../contract/HFLContract.json"),
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

  subscribe(address: string, timeout: number): Readable {
    const src = this.contract.subscribe();
    src.on("data", (event: EventData) => {
      const res = event.returnValues;
      switch (event.event) {
        case "AggregateStarted":
          this.subscriber.publish({
            type: "AggregationStarted",
            taskID: res.taskId,
            round: Number(res.round),
            addrs: res.addrs,
          });
          break;
        case "CalculateStarted":
          this.subscriber.publish({
            type: "CalculationStarted",
            taskID: res.taskId,
            round: Number(res.round),
            addrs: res.addrs,
          });
          break;
        case "PartnerSelected":
          this.subscriber.publish({
            type: "PartnerSelected",
            taskID: res.taskId,
            round: Number(res.round),
            addrs: res.addrs,
          });
          break;
        case "RoundEnd":
          this.subscriber.publish({
            type: "RoundEnded",
            taskID: res.taskId,
            round: Number(res.round),
          });
          break;
        case "RoundStart":
          this.subscriber.publish({
            type: "RoundStarted",
            taskID: res.taskId,
            round: Number(res.round),
          });
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
          });
          break;
        case "TaskFinished":
          this.subscriber.publish({
            type: "TaskFinished",
            taskID: res.taskId,
          });
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
        this.contract.unsubscribe(src);
      }
    }
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

    const hash = await this.contract.method("createTask", [dataset, commitment, taskType]);
    const receipt = await this.contract.waitForReceipt(hash);
    const res = this.contract.decodeLogs(receipt.logs);
    if (!res) {
      throw new Error("createTask has no result");
    }
    return [receipt.transactionHash, res.taskId];
  }

  async finishTask(address: string, taskID: string): Promise<string> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    const hash = await this.contract.method("finishTask", [taskID]);
    await this.contract.waitForReceipt(hash);
    return hash;
  }

  async getTask(taskID: string): Promise<entity.TaskInfo> {
    const res = await this.contract.call("getTask", [taskID]);
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

    const hash = await this.contract.method("startRound", [taskID, round, 100, 1]);
    await this.contract.waitForReceipt(hash);
    return hash;
  }

  async joinRound(address: string, taskID: string, round: number, pk1: string, pk2: string): Promise<string> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    const hash = await this.contract.method("joinRound", [taskID, round, pk1, pk2]);
    await this.contract.waitForReceipt(hash);
    return hash;
  }

  async getTaskRound(taskID: string, round: number): Promise<entity.TaskRoundInfo> {
    const res = await this.contract.call("getTaskRound", [taskID, round]);
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

    const hash = await this.contract.method("selectCandidates", [taskID, round, clients]);
    await this.contract.waitForReceipt(hash);
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

    const hash = await this.contract.method("uploadSeedCommitment", [
      taskID,
      round,
      receivers,
      commitments,
    ]);
    await this.contract.waitForReceipt(hash);
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

    const hash = await this.contract.method("uploadSecretKeyCommitment", [
      taskID,
      round,
      receivers,
      commitments,
    ]);
    await this.contract.waitForReceipt(hash);
    return hash;
  }

  async getClientPublicKeys(taskID: string, round: number, clients: string[]): Promise<[string, string][]> {
    const res = await this.contract.call("getClientPublickeys", [taskID, round, clients]);
    if (typeof res === "string") {
      throw new Error("getClientPublickeys return type error");
    }

    return res.map((item: any) => [item.pk1, item.pk2]);
  }

  async startCalculation(address: string, taskID: string, round: number, clients: string[]): Promise<string> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    const hash = await this.contract.method("startCalculate", [taskID, round, clients]);
    await this.contract.waitForReceipt(hash);
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

    const hash = await this.contract.method("uploadResultCommitment", [taskID, round, commitment]);
    await this.contract.waitForReceipt(hash);
    return hash;
  }

  async getResultCommitment(taskID: string, round: number, client: string): Promise<string> {
    const res = await this.contract.call("getResultCommitment", [taskID, client, round]);
    if (typeof res === "object") {
      throw new Error("getClientPublickeys return type error");
    }

    return res;
  }

  async startAggregation(address: string, taskID: string, round: number, clients: string[]): Promise<string> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }

    const hash = await this.contract.method("startAggregate", [taskID, round, clients]);
    await this.contract.waitForReceipt(hash);
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

    const hash = await this.contract.method("uploadSeed", [taskID, round, senders, seeds]);
    await this.contract.waitForReceipt(hash);
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

    const hash = await this.contract.method("uploadSecretkeyMask", [taskID, round, senders, secretKeys]);
    await this.contract.waitForReceipt(hash);
    return hash;
  }

  async getSecretShareDatas(
    taskID: string,
    round: number,
    senders: string[],
    receiver: string
  ): Promise<entity.SecretShareData[]> {
    const res = await this.contract.call("getSecretSharingDatas", [taskID, round, senders, receiver]);
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

    const hash = await this.contract.method("endRound", [taskID, round]);
    await this.contract.waitForReceipt(hash);
    return hash;
  }
}

export const horizontal = new Horizontal();
