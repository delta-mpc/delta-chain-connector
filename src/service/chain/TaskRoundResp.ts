// Original file: src/service/chain.proto

import type { RoundStatus as _chain_RoundStatus } from "../chain/RoundStatus";

export interface TaskRoundResp {
  round?: number;
  status?: _chain_RoundStatus | keyof typeof _chain_RoundStatus;
  clients?: string[];
}

export interface TaskRoundResp__Output {
  round: number;
  status: _chain_RoundStatus;
  clients: string[];
}
