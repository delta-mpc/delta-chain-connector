// Original file: src/proto/horizontal.proto

import type {
  NodeInfo as _horizontal_NodeInfo,
  NodeInfo__Output as _horizontal_NodeInfo__Output,
} from "../horizontal/NodeInfo";

export interface NodeInfos {
  nodes?: _horizontal_NodeInfo[];
  totalCount?: number;
}

export interface NodeInfos__Output {
  nodes: _horizontal_NodeInfo__Output[];
  totalCount: number;
}
