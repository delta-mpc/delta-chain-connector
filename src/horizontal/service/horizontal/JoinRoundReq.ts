// Original file: src/proto/horizontal.proto

export interface JoinRoundReq {
  address?: string;
  taskId?: string;
  round?: number;
  pk1?: string;
  pk2?: string;
}

export interface JoinRoundReq__Output {
  address: string;
  taskId: string;
  round: number;
  pk1: string;
  pk2: string;
}
