// Original file: src/service/chain.proto

export interface PublicKeyReq {
  taskId?: string;
  round?: number;
  clients?: string[];
}

export interface PublicKeyReq__Output {
  taskId: string;
  round: number;
  clients: string[];
}
