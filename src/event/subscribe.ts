import { PassThrough, Readable, Writable } from "stream";
import log from "~/log";
import { Event } from "./common";

class EventStream<T extends Event> {
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

  write(event: T) {
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

export class Subscriber<T extends Event> {
  private streamMap: Map<Readable, EventStream<T>> = new Map();

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

  publish(event: T): void {
    for (const eventStrem of this.streamMap.values()) {
      eventStrem.write(event);
    }
  }
}
