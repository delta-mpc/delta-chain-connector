// Original file: src/proto/subscribe.proto

export interface TaskVerifiedEvent {
  taskId?: string;
  verified?: boolean;
}

export interface TaskVerifiedEvent__Output {
  taskId: string;
  verified: boolean;
}
