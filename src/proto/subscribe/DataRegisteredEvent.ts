// Original file: src/proto/subscribe.proto

export interface DataRegisteredEvent {
  owner?: string;
  name?: string;
  index?: number;
  commitment?: string;
}

export interface DataRegisteredEvent__Output {
  owner: string;
  name: string;
  index: number;
  commitment: string;
}
