// Original file: src/proto/subscribe.proto

export interface TaskMemberVerifiedEvent {
  taskId?: string;
  address?: string;
  verified?: boolean;
}

export interface TaskMemberVerifiedEvent__Output {
  taskId: string;
  address: string;
  verified: boolean;
}
