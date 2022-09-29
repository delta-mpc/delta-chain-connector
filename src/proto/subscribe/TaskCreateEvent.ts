// Original file: src/proto/subscribe.proto

export interface TaskCreateEvent {
  address?: string;
  taskId?: string;
  dataset?: string;
  url?: string;
  commitment?: string;
  taskType?: string;
  enableVerify?: boolean;
  tolerance?: number;
}

export interface TaskCreateEvent__Output {
  address: string;
  taskId: string;
  dataset: string;
  url: string;
  commitment: string;
  taskType: string;
  enableVerify: boolean;
  tolerance: number;
}
