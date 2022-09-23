// Original file: src/proto/hlr.proto

export interface Share {
  address?: string;
  taskId?: string;
  round?: number;
  senders?: string[];
  shares?: string[];
}

export interface Share__Output {
  address: string;
  taskId: string;
  round: number;
  senders: string[];
  shares: string[];
}
