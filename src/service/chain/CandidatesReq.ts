// Original file: src/service/chain.proto

export interface CandidatesReq {
  address?: string;
  taskId?: string;
  round?: number;
  clients?: string[];
}

export interface CandidatesReq__Output {
  address: string;
  taskId: string;
  round: number;
  clients: string[];
}
