// Original file: src/proto/subscribe.proto

export interface EventReq {
  address?: string;
  timeout?: number;
}

export interface EventReq__Output {
  address: string;
  timeout: number;
}
