// Original file: src/proto/hlr.proto

export interface ResultCommitment {
  address?: string;
  taskId?: string;
  round?: number;
  commitment?: string;
}

export interface ResultCommitment__Output {
  address: string;
  taskId: string;
  round: number;
  commitment: string;
}
