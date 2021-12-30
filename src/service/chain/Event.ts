// Original file: src/service/chain.proto

import type {
  TaskCreateEvent as _chain_TaskCreateEvent,
  TaskCreateEvent__Output as _chain_TaskCreateEvent__Output,
} from "../chain/TaskCreateEvent";
import type {
  RoundStartedEvent as _chain_RoundStartedEvent,
  RoundStartedEvent__Output as _chain_RoundStartedEvent__Output,
} from "../chain/RoundStartedEvent";
import type {
  PartnerSelectedEvent as _chain_PartnerSelectedEvent,
  PartnerSelectedEvent__Output as _chain_PartnerSelectedEvent__Output,
} from "../chain/PartnerSelectedEvent";
import type {
  CalculationStartedEvent as _chain_CalculationStartedEvent,
  CalculationStartedEvent__Output as _chain_CalculationStartedEvent__Output,
} from "../chain/CalculationStartedEvent";
import type {
  AggregationStartedEvent as _chain_AggregationStartedEvent,
  AggregationStartedEvent__Output as _chain_AggregationStartedEvent__Output,
} from "../chain/AggregationStartedEvent";
import type {
  RoundEndedEvent as _chain_RoundEndedEvent,
  RoundEndedEvent__Output as _chain_RoundEndedEvent__Output,
} from "../chain/RoundEndedEvent";
import type {
  TaskFinishEvent as _chain_TaskFinishEvent,
  TaskFinishEvent__Output as _chain_TaskFinishEvent__Output,
} from "../chain/TaskFinishEvent";

export interface Event {
  taskCreated?: _chain_TaskCreateEvent | null;
  roundStarted?: _chain_RoundStartedEvent | null;
  partnerSelected?: _chain_PartnerSelectedEvent | null;
  calculationStarted?: _chain_CalculationStartedEvent | null;
  aggregationStarted?: _chain_AggregationStartedEvent | null;
  roundEnded?: _chain_RoundEndedEvent | null;
  taskFinished?: _chain_TaskFinishEvent | null;
  event?:
    | "taskCreated"
    | "roundStarted"
    | "partnerSelected"
    | "calculationStarted"
    | "aggregationStarted"
    | "roundEnded"
    | "taskFinished";
}

export interface Event__Output {
  taskCreated?: _chain_TaskCreateEvent__Output | null;
  roundStarted?: _chain_RoundStartedEvent__Output | null;
  partnerSelected?: _chain_PartnerSelectedEvent__Output | null;
  calculationStarted?: _chain_CalculationStartedEvent__Output | null;
  aggregationStarted?: _chain_AggregationStartedEvent__Output | null;
  roundEnded?: _chain_RoundEndedEvent__Output | null;
  taskFinished?: _chain_TaskFinishEvent__Output | null;
  event:
    | "taskCreated"
    | "roundStarted"
    | "partnerSelected"
    | "calculationStarted"
    | "aggregationStarted"
    | "roundEnded"
    | "taskFinished";
}
