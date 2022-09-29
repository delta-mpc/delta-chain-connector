// Original file: src/proto/subscribe.proto

import type {
  TaskCreateEvent as _subscribe_TaskCreateEvent,
  TaskCreateEvent__Output as _subscribe_TaskCreateEvent__Output,
} from "../subscribe/TaskCreateEvent";
import type {
  RoundStartedEvent as _subscribe_RoundStartedEvent,
  RoundStartedEvent__Output as _subscribe_RoundStartedEvent__Output,
} from "../subscribe/RoundStartedEvent";
import type {
  PartnerSelectedEvent as _subscribe_PartnerSelectedEvent,
  PartnerSelectedEvent__Output as _subscribe_PartnerSelectedEvent__Output,
} from "../subscribe/PartnerSelectedEvent";
import type {
  CalculationStartedEvent as _subscribe_CalculationStartedEvent,
  CalculationStartedEvent__Output as _subscribe_CalculationStartedEvent__Output,
} from "../subscribe/CalculationStartedEvent";
import type {
  AggregationStartedEvent as _subscribe_AggregationStartedEvent,
  AggregationStartedEvent__Output as _subscribe_AggregationStartedEvent__Output,
} from "../subscribe/AggregationStartedEvent";
import type {
  RoundEndedEvent as _subscribe_RoundEndedEvent,
  RoundEndedEvent__Output as _subscribe_RoundEndedEvent__Output,
} from "../subscribe/RoundEndedEvent";
import type {
  TaskFinishEvent as _subscribe_TaskFinishEvent,
  TaskFinishEvent__Output as _subscribe_TaskFinishEvent__Output,
} from "../subscribe/TaskFinishEvent";
import type {
  HeartBeatEvent as _subscribe_HeartBeatEvent,
  HeartBeatEvent__Output as _subscribe_HeartBeatEvent__Output,
} from "../subscribe/HeartBeatEvent";
import type {
  TaskMemberVerifiedEvent as _subscribe_TaskMemberVerifiedEvent,
  TaskMemberVerifiedEvent__Output as _subscribe_TaskMemberVerifiedEvent__Output,
} from "../subscribe/TaskMemberVerifiedEvent";
import type {
  TaskVerificationConfirmedEvent as _subscribe_TaskVerificationConfirmedEvent,
  TaskVerificationConfirmedEvent__Output as _subscribe_TaskVerificationConfirmedEvent__Output,
} from "../subscribe/TaskVerificationConfirmedEvent";
import type {
  DataRegisteredEvent as _subscribe_DataRegisteredEvent,
  DataRegisteredEvent__Output as _subscribe_DataRegisteredEvent__Output,
} from "../subscribe/DataRegisteredEvent";

export interface Event {
  taskCreated?: _subscribe_TaskCreateEvent | null;
  roundStarted?: _subscribe_RoundStartedEvent | null;
  partnerSelected?: _subscribe_PartnerSelectedEvent | null;
  calculationStarted?: _subscribe_CalculationStartedEvent | null;
  aggregationStarted?: _subscribe_AggregationStartedEvent | null;
  roundEnded?: _subscribe_RoundEndedEvent | null;
  taskFinished?: _subscribe_TaskFinishEvent | null;
  heartbeat?: _subscribe_HeartBeatEvent | null;
  taskMemberVerified?: _subscribe_TaskMemberVerifiedEvent | null;
  taskVerificationConfirmed?: _subscribe_TaskVerificationConfirmedEvent | null;
  dataRegistered?: _subscribe_DataRegisteredEvent | null;
  event?:
    | "taskCreated"
    | "roundStarted"
    | "partnerSelected"
    | "calculationStarted"
    | "aggregationStarted"
    | "roundEnded"
    | "taskFinished"
    | "heartbeat"
    | "taskMemberVerified"
    | "taskVerificationConfirmed"
    | "dataRegistered";
}

export interface Event__Output {
  taskCreated?: _subscribe_TaskCreateEvent__Output | null;
  roundStarted?: _subscribe_RoundStartedEvent__Output | null;
  partnerSelected?: _subscribe_PartnerSelectedEvent__Output | null;
  calculationStarted?: _subscribe_CalculationStartedEvent__Output | null;
  aggregationStarted?: _subscribe_AggregationStartedEvent__Output | null;
  roundEnded?: _subscribe_RoundEndedEvent__Output | null;
  taskFinished?: _subscribe_TaskFinishEvent__Output | null;
  heartbeat?: _subscribe_HeartBeatEvent__Output | null;
  taskMemberVerified?: _subscribe_TaskMemberVerifiedEvent__Output | null;
  taskVerificationConfirmed?: _subscribe_TaskVerificationConfirmedEvent__Output | null;
  dataRegistered?: _subscribe_DataRegisteredEvent__Output | null;
  event:
    | "taskCreated"
    | "roundStarted"
    | "partnerSelected"
    | "calculationStarted"
    | "aggregationStarted"
    | "roundEnded"
    | "taskFinished"
    | "heartbeat"
    | "taskMemberVerified"
    | "taskVerificationConfirmed"
    | "dataRegistered";
}
