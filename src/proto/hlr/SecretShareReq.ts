// Original file: src/proto/hlr.proto

export interface SecretShareReq {
  taskId?: string;
  round?: number;
  senders?: string[];
  receiver?: string;
}

export interface SecretShareReq__Output {
  taskId: string;
  round: number;
  senders: string[];
  receiver: string;
}
