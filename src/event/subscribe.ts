import { PassThrough, Readable } from "stream";
import log from "~/log";
import { Event } from "./common";

export class Subscriber<T extends Event> {
  private streams: Map<PassThrough, string> = new Map();

  subscribe(address: string): Readable {
    const stream = new PassThrough({ objectMode: true });
    this.streams.set(stream, address);
    return stream;
  }

  unsubscribe(stream: Readable): void {
    const address = this.streams.get(stream as PassThrough);
    stream.destroy();
    log.debug(`destroy event stream for ${address}`);
  }

  publish(event: T): void {
    for (const [stream, address] of this.streams.entries()) {
      stream.write(event);
      log.debug(`send event ${event.type} to ${address}`);
    }
  }
}
