// Original file: src/proto/identity.proto

import type {
  NodeInfo as _identity_NodeInfo,
  NodeInfo__Output as _identity_NodeInfo__Output,
} from "../identity/NodeInfo";

export interface NodeInfos {
  nodes?: _identity_NodeInfo[];
  totalCount?: number;
}

export interface NodeInfos__Output {
  nodes: _identity_NodeInfo__Output[];
  totalCount: number;
}
