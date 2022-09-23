// Original file: src/proto/hlr.proto

export interface StartRoundReq {
  address?: string;
  taskId?: string;
  round?: number;
  weightCommitment?: string;
}

export interface StartRoundReq__Output {
  address: string;
  taskId: string;
  round: number;
  weightCommitment: string;
}
