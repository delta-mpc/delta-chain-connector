// Original file: src/service/chain.proto

export interface AggregationStartedEvent {
  taskId?: string;
  round?: number;
  addrs?: string[];
}

export interface AggregationStartedEvent__Output {
  taskId: string;
  round: number;
  addrs: string[];
}
