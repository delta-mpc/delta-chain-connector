interface TaskCreatedEvent {
  type: "TaskCreated";
  address: string;
  taskID: string;
  dataset: string;
  url: string;
  commitment: string;
  taskType: string;
}

interface RoundStartedEvent {
  type: "RoundStarted";
  taskID: string;
  round: number;
}

interface PartnerSelectedEvent {
  type: "PartnerSelected";
  taskID: string;
  round: number;
  addrs: string[];
}

interface CalculationStartedEvent {
  type: "CalculationStarted";
  taskID: string;
  round: number;
  addrs: string[];
}

interface AggregationStartedEvent {
  type: "AggregationStarted";
  taskID: string;
  round: number;
  addrs: string[];
}

interface RoundEndedEvent {
  type: "RoundEnded";
  taskID: string;
  round: number;
}

interface TaskFinishedEvent {
  type: "TaskFinished";
  taskID: string;
}

export type HorizontalEvent =
  | TaskCreatedEvent
  | RoundStartedEvent
  | PartnerSelectedEvent
  | CalculationStartedEvent
  | AggregationStartedEvent
  | RoundEndedEvent
  | TaskFinishedEvent;
