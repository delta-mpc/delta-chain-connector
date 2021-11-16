import { Writable } from "stream";

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
  url: string;
  name: string;
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

export interface Service {
  init(): Promise<void>;
  join(url: string, name: string): Promise<string>;
  updateUrl(address: string, url: string): Promise<void>;
  updateName(address: string, name: string): Promise<void>;
  leave(address: string): Promise<void>;
  getNodeInfo(address: string): Promise<NodeInfo>;
  createTask(address: string, dataset: string, commitment: string): Promise<string>;
  startRound(address: string, taskID: string, round: number): Promise<void>;
  joinRound(address: string, taskID: string, round: number, pk1: string, pk2: string): Promise<void>;
  getTaskRound(taskID: string, round: number): Promise<TaskRoundInfo>;
  selectCandidates(address: string, taskID: string, round: number, clients: string[]): Promise<void>;
  uploadSeedCommitment(
    address: string,
    taskID: string,
    round: number,
    receiver: string,
    commitment: string
  ): Promise<void>;
  uploadSecretKeyCommitment(
    address: string,
    taskID: string,
    round: number,
    receiver: string,
    commitment: string
  ): Promise<void>;
  getClientPublickKeys(taskID: string, round: number, client: string): Promise<[string, string]>;
  startCalculation(address: string, taskID: string, round: number, clients: string[]): Promise<void>;
  uploadResultCommitment(address: string, taskID: string, round: number, commitment: string): Promise<void>;
  getResultCommitment(taskID: string, round: number, client: string): Promise<string>;
  startAggregation(address: string, taskID: string, round: number, clients: string[]): Promise<void>;
  uploadSeed(address: string, taskID: string, round: number, sender: string, seed: string): Promise<void>;
  uploadSecretKey(
    address: string,
    taskID: string,
    round: number,
    sender: string,
    secretKey: string
  ): Promise<void>;
  getSecretShareData(
    taskID: string,
    round: number,
    sender: string,
    receiver: string
  ): Promise<SecretShareData>;
  endRound(address: string, taskID: string, round: number): Promise<void>;
  subscribe(dst: Writable): void;
  unsubscribe(dst: Writable): void;
}
