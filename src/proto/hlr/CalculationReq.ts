// Original file: src/proto/hlr.proto

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
