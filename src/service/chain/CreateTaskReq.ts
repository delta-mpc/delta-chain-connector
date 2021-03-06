// Original file: src/service/chain.proto

export interface CreateTaskReq {
  address?: string;
  dataset?: string;
  commitment?: string;
  taskType?: string;
}

export interface CreateTaskReq__Output {
  address: string;
  dataset: string;
  commitment: string;
  taskType: string;
}
