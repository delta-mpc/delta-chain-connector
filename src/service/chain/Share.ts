// Original file: src/service/chain.proto

export interface Share {
  address?: string;
  taskId?: string;
  round?: number;
  sender?: string;
  share?: string;
}

export interface Share__Output {
  address: string;
  taskId: string;
  round: number;
  sender: string;
  share: string;
}
