import { HorizontalEvent } from "./horizontal";

interface TaskCreatedEvent {
  type: "HLRTaskCreated";
  address: string;
  taskID: string;
  dataset: string;
  url: string;
  commitment: string;
  taskType: string;
  enableVerify: boolean;
  tolerance: number;
}

interface TaskMemberVerifiedEvent {
  type: "TaskMemberVerified";
  taskID: string;
  address: string;
  verified: boolean;
}

interface TaskVerificationConfirmedEvent {
  type: "TaskVerificationConfirmed";
  taskID: string;
}

export type HLREvent =
  | HorizontalEvent
  | TaskMemberVerifiedEvent
  | TaskVerificationConfirmedEvent
  | TaskCreatedEvent;
