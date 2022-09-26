// Original file: src/proto/hlr.proto

import type { RoundStatus as _hlr_RoundStatus } from "../hlr/RoundStatus";

export interface TaskRoundResp {
  round?: number;
  status?: _hlr_RoundStatus | keyof typeof _hlr_RoundStatus;
  joinedClients?: string[];
  finishedClients?: string[];
}

export interface TaskRoundResp__Output {
  round: number;
  status: _hlr_RoundStatus;
  joinedClients: string[];
  finishedClients: string[];
}
