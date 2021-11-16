// Original file: src/service/chain.proto

export interface ShareCommitment {
  address?: string;
  taskId?: string;
  round?: number;
  receiver?: string;
  commitment?: string;
}

export interface ShareCommitment__Output {
  address: string;
  taskId: string;
  round: number;
  receiver: string;
  commitment: string;
}
