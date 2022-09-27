import { Readable } from "stream";
import { config } from "~/config";
import { hlr as ci } from "~/coordinator";
import { SecretShareData, TaskInfo, TaskRoundInfo, VerifierState } from "~/entity/hlr";
import { hlr as ei } from "~/ethereum";

export interface HLRImpl {
  init(): Promise<void>;
  createTask(
    address: string,
    dataset: string,
    commitment: string,
    enableVerify: boolean,
    tolerance: number
  ): Promise<[string, string]>;
  finishTask(address: string, taskID: string): Promise<string>;
  getTask(taskID: string): Promise<TaskInfo>;
  startRound(address: string, taskID: string, round: number, weightCommitment: string): Promise<string>;
  getWeightCommitment(taskID: string, round: number): Promise<string>;
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
  verify(
    address: string,
    taskID: string,
    weightSize: number,
    proof: string,
    pubSignals: string[],
    blockIndex: number,
    samples: number
  ): Promise<[string, boolean]>;
  getVerifierState(taskID: string): Promise<VerifierState>;
  confirmVerification(address: string, taskID: string): Promise<string>;
  subscribe(address: string): Readable;
  unsubscribe(stream: Readable): void;
}

let impl: HLRImpl | undefined = undefined;

function init(): HLRImpl {
  if (config.impl === "coordinator") {
    return ci;
  } else {
    return ei;
  }
}

export function getHLR(): HLRImpl {
  if (impl === undefined) {
    impl = init();
  }
  return impl;
}
