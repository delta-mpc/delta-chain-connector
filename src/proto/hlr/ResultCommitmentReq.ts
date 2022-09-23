// Original file: src/proto/hlr.proto

export interface ResultCommitmentReq {
  taskId?: string;
  round?: number;
  client?: string;
}

export interface ResultCommitmentReq__Output {
  taskId: string;
  round: number;
  client: string;
}
