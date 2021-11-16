// Original file: src/service/chain.proto

export interface StartRoundReq {
  address?: string;
  taskId?: string;
  round?: number;
}

export interface StartRoundReq__Output {
  address: string;
  taskId: string;
  round: number;
}
