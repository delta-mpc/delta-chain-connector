import { Readable } from "stream";
import { config } from "~/config";
import { datahub as ci } from "~/coordinator";
import { datahub as ei } from "~/ethereum";

export interface DataHubImpl {
  init(): Promise<void>;
  register(address: string, name: string, index: number, commitment: string): Promise<string>;
  getDataCommitment(address: string, name: string, index: number): Promise<string>;
  subscribe(address: string): Readable;
  unsubscribe(stream: Readable): void;
}

let impl: DataHubImpl | undefined = undefined;

function init(): DataHubImpl {
  if (config.impl === "coordinator") {
    return ci;
  } else {
    return ei;
  }
}

export function getDataHub(): DataHubImpl {
  if (impl === undefined) {
    impl = init();
  }
  return impl;
}
