// Original file: src/proto/subscribe.proto

export interface PartnerSelectedEvent {
  taskId?: string;
  round?: number;
  addrs?: string[];
}

export interface PartnerSelectedEvent__Output {
  taskId: string;
  round: number;
  addrs: string[];
}
