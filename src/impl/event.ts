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

export interface TaskFinishedEvent {
  type: "TaskFinished";
  taskID: string;
}

export interface HeartBeatEvent {
  type: "Heartbeat";
}

export type Event =
  | TaskCreatedEvent
  | RoundStartedEvent
  | PartnerSelectedEvent
  | CalculationStartedEvent
  | AggregationStartedEvent
  | RoundEndedEvent
  | TaskFinishedEvent
  | HeartBeatEvent;

export class Subscriber {
  private streams: PassThrough[] = [];
  private timers: (NodeJS.Timer | null)[] = [];

  subscribe(timeout: number): Readable {
    const stream = new PassThrough({ objectMode: true });
    this.streams.push(stream);
    if (timeout > 0) {
      const timer = setInterval(() => {
        stream.write({ type: "Heartbeat" });
      }, timeout * 1000);
      this.timers.push(timer);
    } else {
      this.timers.push(null);
    }
    return stream;
  }

  unsubscribe(stream: Readable): void {
    if (this.streams.length > 0) {
      const i = this.streams.indexOf(stream as PassThrough);
      this.streams.splice(i);
      const timer = this.timers[i];
      if (timer) {
        clearInterval(timer);
      }
      this.timers.splice(i);
    }
  }

  publish(event: Event): void {
    for (const stream of this.streams) {
      stream.write(event);
    }
  }
}
