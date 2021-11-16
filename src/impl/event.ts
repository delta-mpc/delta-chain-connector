import { Writable } from "stream";

export interface TaskCreatedEvent {
  type: "TaskCreated";
  address: string;
  taskID: string;
  dataset: string;
  url: string;
  commitment: string;
}

export interface RoundStartedEvent {
  type: "RoundStarted";
  taskID: string;
  round: number;
}

export interface PartnerSelectedEvent {
  type: "PartnerSelected";
  taskID: string;
  round: number;
  addrs: string[];
}

export interface CalculationStartedEvent {
  type: "CalculationStarted";
  taskID: string;
  round: number;
  addrs: string[];
}

export interface AggregationStartedEvent {
  type: "AggregationStarted";
  taskID: string;
  round: number;
  addrs: string[];
}

export interface RoundEndedEvent {
  type: "RoundEnded";
  taskID: string;
  round: number;
}

export type Event =
  | TaskCreatedEvent
  | RoundStartedEvent
  | PartnerSelectedEvent
  | CalculationStartedEvent
  | AggregationStartedEvent
  | RoundEndedEvent;

export class Subscriber {
  readonly streams: Writable[] = [];

  publish(event: Event): void {
    for (const stream of this.streams) {
      stream.write(event);
    }
  }

  subscribe(dst: Writable): void {
    this.streams.push(dst);
  }

  unsubscribe(dst: Writable): void {
    const i = this.streams.indexOf(dst);
    if (i > -1) {
      this.streams.splice(i);
    }
  }
}
