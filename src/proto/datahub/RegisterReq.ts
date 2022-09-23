// Original file: src/proto/datahub.proto

export interface RegisterReq {
  address?: string;
  name?: string;
  index?: number;
  commitment?: string;
}

export interface RegisterReq__Output {
  address: string;
  name: string;
  index: number;
  commitment: string;
}
