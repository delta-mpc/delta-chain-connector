import { Readable } from "stream";
import { TaskInfo, TaskRoundInfo, SecretShareData } from "~/entity/horizontal";
import { horizontal as ch } from "~/coordinator/horizontal";
import { horizontal as eh } from "~/ethereum/horizontal";
import { config } from "~/config";

export interface HorizontalImpl {
  init(): Promise<void>;
  createTask(
    address: string,
    dataset: string,
    commitment: string,
    taskType: string
  ): Promise<[string, string]>;
  finishTask(address: string, taskID: string): Promise<string>;
  getTask(taskID: string): Promise<TaskInfo>;
  startRound(address: string, taskID: string, round: number): Promise<string>;
  joinRound(address: string, taskID: string, round: number, pk1: string, pk2: string): Promise<string>;
  getTaskRound(taskID: string, round: number): Promise<TaskRoundInfo>;
  selectCandidates(address: string, taskID: string, round: number, clients: string[]): Promise<string>;
  uploadSeedCommitment(
    address: string,
    taskID: string,
    round: number,
    receivers: string[],
    commitments: string[]
  ): Promise<string>;
  uploadSecretKeyCommitment(
    address: string,
    taskID: string,
    round: number,
    receivers: string[],
    commitments: string[]
  ): Promise<string>;
  getClientPublicKeys(taskID: string, round: number, clients: string[]): Promise<[string, string][]>;
  startCalculation(address: string, taskID: string, round: number, clients: string[]): Promise<string>;
  uploadResultCommitment(address: string, taskID: string, round: number, commitment: string): Promise<string>;
  getResultCommitment(taskID: string, round: number, client: string): Promise<string>;
  startAggregation(address: string, taskID: string, round: number, clients: string[]): Promise<string>;
  uploadSeed(
    address: string,
    taskID: string,
    round: number,
    senders: string[],
    seeds: string[]
  ): Promise<string>;
  uploadSecretKey(
    address: string,
    taskID: string,
    round: number,
    senders: string[],
    secretKeys: string[]
  ): Promise<string>;
  getSecretShareDatas(
    taskID: string,
    round: number,
    senders: string[],
    receiver: string
  ): Promise<SecretShareData[]>;
  endRound(address: string, taskID: string, round: number): Promise<string>;
  subscribe(address: string): Readable;
  unsubscribe(stream: Readable): void;
}

let _horizontal: HorizontalImpl | undefined = undefined;

function init(): HorizontalImpl {
  if (config.impl == "coordinator") {
    return ch;
  } else {
    return eh;
  }
}

export function getHorizontal(): HorizontalImpl {
  if (_horizontal === undefined) {
    _horizontal = init();
  }
  return _horizontal;
}
