// Original file: src/proto/hlr.proto

export interface VerifyState {
  unfinishedClients?: string[];
  invalidClients?: string[];
  valid?: boolean;
}

export interface VerifyState__Output {
  unfinishedClients: string[];
  invalidClients: string[];
  valid: boolean;
}
