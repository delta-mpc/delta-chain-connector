// Original file: src/proto/horizontal.proto

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
