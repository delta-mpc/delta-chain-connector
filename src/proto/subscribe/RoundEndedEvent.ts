// Original file: src/proto/subscribe.proto

export interface RoundEndedEvent {
  taskId?: string;
  round?: number;
}

export interface RoundEndedEvent__Output {
  taskId: string;
  round: number;
}
