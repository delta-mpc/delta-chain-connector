// Original file: src/service/chain.proto

export interface PublicKeyReq {
  taskId?: string;
  round?: number;
  client?: string;
}

export interface PublicKeyReq__Output {
  taskId: string;
  round: number;
  client: string;
}
