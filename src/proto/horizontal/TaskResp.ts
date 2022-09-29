// Original file: src/proto/horizontal.proto

export interface TaskResp {
  address?: string;
  url?: string;
  taskId?: string;
  dataset?: string;
  commitment?: string;
  taskType?: string;
  finished?: boolean;
}

export interface TaskResp__Output {
  address: string;
  url: string;
  taskId: string;
  dataset: string;
  commitment: string;
  taskType: string;
  finished: boolean;
}
