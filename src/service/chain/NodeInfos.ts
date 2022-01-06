// Original file: src/service/chain.proto

import type {
  NodeInfo as _chain_NodeInfo,
  NodeInfo__Output as _chain_NodeInfo__Output,
} from "../chain/NodeInfo";

export interface NodeInfos {
  nodes?: _chain_NodeInfo[];
  totalCount?: number;
}

export interface NodeInfos__Output {
  nodes: _chain_NodeInfo__Output[];
  totalCount: number;
}
