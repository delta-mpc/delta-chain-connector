import { Readable } from "stream";

export interface DataHubImpl {
  init(): Promise<void>;
  register(address: string, name: string, index: number, commitment: string): Promise<string>;
  getDataCommitment(address: string, name: string, index: number): Promise<string>;
  subscribe(address: string, timeout: number): Readable;
  unsubscribe(stream: Readable): void;
}
