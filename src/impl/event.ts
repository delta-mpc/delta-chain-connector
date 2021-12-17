import { PassThrough, Readable } from "stream";

export interface TaskCreatedEvent {
  type: "TaskCreated";
  address: string;
  taskID: string;
  dataset: string;
  url: string;
  commitment: string;
  taskType: string;
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
  private streams: PassThrough[] = [];

  subscribe(): Readable {
    const stream = new PassThrough({ objectMode: true });
    this.streams.push(stream);
    return stream;
  }

  unsubscribe(stream: Readable): void {
    const i = this.streams.indexOf(stream as PassThrough);
    this.streams.splice(i);
  }

  publish(event: Event): void {
    for (const stream of this.streams) {
      stream.write(event);
    }
  }
}
