// Original file: src/proto/horizontal.proto

import type { TaskCreateEvent as _horizontal_TaskCreateEvent, TaskCreateEvent__Output as _horizontal_TaskCreateEvent__Output } from '../horizontal/TaskCreateEvent';
import type { RoundStartedEvent as _horizontal_RoundStartedEvent, RoundStartedEvent__Output as _horizontal_RoundStartedEvent__Output } from '../horizontal/RoundStartedEvent';
import type { PartnerSelectedEvent as _horizontal_PartnerSelectedEvent, PartnerSelectedEvent__Output as _horizontal_PartnerSelectedEvent__Output } from '../horizontal/PartnerSelectedEvent';
import type { CalculationStartedEvent as _horizontal_CalculationStartedEvent, CalculationStartedEvent__Output as _horizontal_CalculationStartedEvent__Output } from '../horizontal/CalculationStartedEvent';
import type { AggregationStartedEvent as _horizontal_AggregationStartedEvent, AggregationStartedEvent__Output as _horizontal_AggregationStartedEvent__Output } from '../horizontal/AggregationStartedEvent';
import type { RoundEndedEvent as _horizontal_RoundEndedEvent, RoundEndedEvent__Output as _horizontal_RoundEndedEvent__Output } from '../horizontal/RoundEndedEvent';
import type { TaskFinishEvent as _horizontal_TaskFinishEvent, TaskFinishEvent__Output as _horizontal_TaskFinishEvent__Output } from '../horizontal/TaskFinishEvent';
import type { HeartBeatEvent as _horizontal_HeartBeatEvent, HeartBeatEvent__Output as _horizontal_HeartBeatEvent__Output } from '../horizontal/HeartBeatEvent';

export interface Event {
  'taskCreated'?: (_horizontal_TaskCreateEvent | null);
  'roundStarted'?: (_horizontal_RoundStartedEvent | null);
  'partnerSelected'?: (_horizontal_PartnerSelectedEvent | null);
  'calculationStarted'?: (_horizontal_CalculationStartedEvent | null);
  'aggregationStarted'?: (_horizontal_AggregationStartedEvent | null);
  'roundEnded'?: (_horizontal_RoundEndedEvent | null);
  'taskFinished'?: (_horizontal_TaskFinishEvent | null);
  'heartbeat'?: (_horizontal_HeartBeatEvent | null);
  'event'?: "taskCreated"|"roundStarted"|"partnerSelected"|"calculationStarted"|"aggregationStarted"|"roundEnded"|"taskFinished"|"heartbeat";
}

export interface Event__Output {
  'taskCreated'?: (_horizontal_TaskCreateEvent__Output | null);
  'roundStarted'?: (_horizontal_RoundStartedEvent__Output | null);
  'partnerSelected'?: (_horizontal_PartnerSelectedEvent__Output | null);
  'calculationStarted'?: (_horizontal_CalculationStartedEvent__Output | null);
  'aggregationStarted'?: (_horizontal_AggregationStartedEvent__Output | null);
  'roundEnded'?: (_horizontal_RoundEndedEvent__Output | null);
  'taskFinished'?: (_horizontal_TaskFinishEvent__Output | null);
  'heartbeat'?: (_horizontal_HeartBeatEvent__Output | null);
  'event': "taskCreated"|"roundStarted"|"partnerSelected"|"calculationStarted"|"aggregationStarted"|"roundEnded"|"taskFinished"|"heartbeat";
}
