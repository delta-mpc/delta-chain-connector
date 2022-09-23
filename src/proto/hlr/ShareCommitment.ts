// Original file: src/proto/hlr.proto

export interface ShareCommitment {
  address?: string;
  taskId?: string;
  round?: number;
  receivers?: string[];
  commitments?: string[];
}

export interface ShareCommitment__Output {
  address: string;
  taskId: string;
  round: number;
  receivers: string[];
  commitments: string[];
}
