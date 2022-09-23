// Original file: src/proto/subscribe.proto

export interface CalculationStartedEvent {
  taskId?: string;
  round?: number;
  addrs?: string[];
}

export interface CalculationStartedEvent__Output {
  taskId: string;
  round: number;
  addrs: string[];
}
