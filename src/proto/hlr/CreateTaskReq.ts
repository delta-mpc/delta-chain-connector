// Original file: src/proto/hlr.proto

export interface CreateTaskReq {
  address?: string;
  dataset?: string;
  commitment?: string;
  enableVerify?: boolean;
  tolerance?: number;
}

export interface CreateTaskReq__Output {
  address: string;
  dataset: string;
  commitment: string;
  enableVerify: boolean;
  tolerance: number;
}
