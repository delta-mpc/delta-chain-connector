import { Readable } from "stream";

export interface DataHubImpl {
  init(): Promise<void>;
  register(address: string, name: string, commitment: string): Promise<string>;
  getDataCommitment(address: string, name: string): Promise<string>;
  getDataVersion(address: string, name: string): Promise<number>;
  subscribe(address: string, timeout: number): Readable;
  unsubscribe(stream: Readable): void;
}
