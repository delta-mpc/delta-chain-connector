// Original file: src/proto/horizontal.proto

export interface AggregationReq {
  address?: string;
  taskId?: string;
  round?: number;
  clients?: string[];
}

export interface AggregationReq__Output {
  address: string;
  taskId: string;
  round: number;
  clients: string[];
}
