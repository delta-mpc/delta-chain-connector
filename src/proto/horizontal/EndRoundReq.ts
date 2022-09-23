// Original file: src/proto/horizontal.proto

export interface EndRoundReq {
  address?: string;
  taskId?: string;
  round?: number;
}

export interface EndRoundReq__Output {
  address: string;
  taskId: string;
  round: number;
}
