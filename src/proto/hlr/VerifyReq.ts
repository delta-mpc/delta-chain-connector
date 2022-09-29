// Original file: src/proto/hlr.proto

export interface VerifyReq {
  address?: string;
  taskId?: string;
  weightSize?: number;
  proof?: string;
  pubSignals?: string[];
  blockIndex?: number;
  samples?: number;
}

export interface VerifyReq__Output {
  address: string;
  taskId: string;
  weightSize: number;
  proof: string;
  pubSignals: string[];
  blockIndex: number;
  samples: number;
}
