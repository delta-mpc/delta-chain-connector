// Original file: src/service/chain.proto

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
