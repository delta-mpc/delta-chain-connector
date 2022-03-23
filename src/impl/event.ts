import { PassThrough, Readable } from "stream";
import log from "~/log";

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

class EventStream {
  public readonly stream: PassThrough;
  private dst: string;
  private timer: NodeJS.Timer | null;

  constructor(dst: string, timeout: number = 0) {
    this.stream = new PassThrough({ objectMode: true });
    this.dst = dst;
    if (timeout > 0) {
      this.timer = setInterval(() => {
        this.stream.write({ type: "Heartbeat" });
      }, timeout * 1000);
    } else {
      this.timer = null;
    }
  }

  write(event: Event) {
    log.debug(`send event ${event.type} to ${this.dst}`);
    this.stream.write(event);
  }

  destroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.stream.destroy();
    log.debug(`destroy event stream for ${this.dst}`);
  }
}

export class Subscriber {
  private streamMap: Map<Readable, EventStream> = new Map<Readable, EventStream>();

  subscribe(address: string, timeout: number): Readable {
    const stream = new EventStream(address, timeout);
    this.streamMap.set(stream.stream, stream);
    return stream.stream;
  }

  unsubscribe(stream: Readable): void {
    const eventStream = this.streamMap.get(stream);
    if (eventStream) {
      eventStream.destroy();
      this.streamMap.delete(stream);
    }
  }

  publish(event: Event): void {
    for (const eventStrem of this.streamMap.values()) {
      eventStrem.write(event);
    }
  }
}
