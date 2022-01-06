import { Readable } from "stream";

export enum RoundStatus {
  Started,
  Running,
  Calculating,
  Aggregating,
  Finished,
}

export enum KeyType {
  PK1, // public key for communication encryption
  PK2, // public key for mask generation
}

export enum ShareType {
  Seed,
  SecretKey,
}

export interface NodeInfo {
  address: string;
  url: string;
  name: string;
}

export interface NodeInfosPage {
  nodes: NodeInfo[];
  totalCount: number;
}

export interface TaskInfo {
  address: string;
  url: string;
  taskID: string;
  dataset: string;
  commitment: string;
  taskType: string;
  finished: boolean;
}

export interface TaskRoundInfo {
  round: number;
  status: number;
  clients: string[];
}

export interface SecretShareData {
  seed?: string;
  seedCommitment?: string;
  secretKey?: string;
  secretKeyCommitment?: string;
}

export interface Impl {
  init(): Promise<void>;
  join(url: string, name: string): Promise<[string, string]>;
  updateUrl(address: string, url: string): Promise<string>;
  updateName(address: string, name: string): Promise<string>;
  leave(address: string): Promise<string>;
  getNodeInfo(address: string): Promise<NodeInfo>;
  getNodes(page: number, pageSize: number): Promise<NodeInfosPage>;
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
  getClientPublickKeys(taskID: string, round: number, clients: string[]): Promise<[string, string][]>;
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
  subscribe(): Readable;
  unsubscribe(stream: Readable): void;
}
