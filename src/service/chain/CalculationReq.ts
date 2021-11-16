// Original file: src/service/chain.proto

export interface CalculationReq {
  address?: string;
  taskId?: string;
  round?: number;
  clients?: string[];
}

export interface CalculationReq__Output {
  address: string;
  taskId: string;
  round: number;
  clients: string[];
}
