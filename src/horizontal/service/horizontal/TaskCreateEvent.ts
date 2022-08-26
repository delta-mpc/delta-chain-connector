// Original file: src/proto/horizontal.proto

export interface TaskCreateEvent {
  address?: string;
  taskId?: string;
  dataset?: string;
  url?: string;
  commitment?: string;
  taskType?: string;
}

export interface TaskCreateEvent__Output {
  address: string;
  taskId: string;
  dataset: string;
  url: string;
  commitment: string;
  taskType: string;
}
