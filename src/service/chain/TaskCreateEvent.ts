// Original file: src/service/chain.proto

export interface TaskCreateEvent {
  address?: string;
  taskId?: string;
  dataset?: string;
  url?: string;
  commitment?: string;
}

export interface TaskCreateEvent__Output {
  address: string;
  taskId: string;
  dataset: string;
  url: string;
  commitment: string;
}
