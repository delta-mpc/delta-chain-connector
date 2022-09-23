// Original file: src/proto/subscribe.proto

export interface RoundStartedEvent {
  taskId?: string;
  round?: number;
}

export interface RoundStartedEvent__Output {
  taskId: string;
  round: number;
}
