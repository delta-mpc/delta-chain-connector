// Original file: src/proto/horizontal.proto

import type { RoundStatus as _horizontal_RoundStatus } from "../horizontal/RoundStatus";

export interface TaskRoundResp {
  round?: number;
  status?: _horizontal_RoundStatus | keyof typeof _horizontal_RoundStatus;
  clients?: string[];
}

export interface TaskRoundResp__Output {
  round: number;
  status: _horizontal_RoundStatus;
  clients: string[];
}
