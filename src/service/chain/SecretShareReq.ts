// Original file: src/service/chain.proto

export interface SecretShareReq {
  taskId?: string;
  round?: number;
  sender?: string;
  receiver?: string;
}

export interface SecretShareReq__Output {
  taskId: string;
  round: number;
  sender: string;
  receiver: string;
}
