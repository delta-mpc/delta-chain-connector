import { config } from "~/config";
import { identity as ci } from "~/coordinator";
import { NodeInfo, NodeInfosPage } from "~/entity/identity";
import { identity as ei } from "~/ethereum";

export interface IdentityImpl {
  init(): Promise<void>;
  join(url: string, name: string): Promise<[string, string]>;
  updateUrl(address: string, url: string): Promise<string>;
  updateName(address: string, name: string): Promise<string>;
  leave(address: string): Promise<string>;
  getNodeInfo(address: string): Promise<NodeInfo>;
  getNodes(page: number, pageSize: number): Promise<NodeInfosPage>;
}

let _impl: IdentityImpl | undefined = undefined;

function init(): IdentityImpl {
  if (config.impl === "coordinator") {
    return ci;
  } else {
    return ei;
  }
}

export function getIdentity(): IdentityImpl {
  if (_impl === undefined) {
    _impl = init();
  }
  return _impl;
}
