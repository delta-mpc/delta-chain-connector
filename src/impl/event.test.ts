import { Writable } from "stream";
import { Event, Subscriber } from "./event";
import { assert } from "chai";

class TestStream extends Writable {
  private _events: Event[];

  get events(): Event[] {
    return this._events;
  }

  constructor() {
    super({ objectMode: true });
    this._events = [];
  }

  _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void) {
    this._events.push(chunk as Event);
    callback();
  }

}

describe("Subscriber", function () {
  it("subscribe and publish", function () {
    const testStream = new TestStream();
    const subscriber = new Subscriber();

    const events: Event[] = [
      {
        type: "TaskCreated",
        address: "1",
        taskID: "1",
        dataset: "1",
        url: "1",
        commitment: "1",
      },
      {
        type: "RoundStarted",
        taskID: "1",
        round: 1,
      },
      {
        type: "PartnerSelected",
        taskID: "1",
        round: 1,
        addrs: ["2", "3"],
      },
      {
        type: "CalculationStarted",
        taskID: "1",
        round: 1,
        addrs: ["2", "3"],
      },
      {
        type: "AggregationStarted",
        taskID: "1",
        round: 1,
        addrs: ["2", "3"],
      },
      {
        type: "RoundEnded",
        taskID: "1",
        round: 1,
      },
    ];

    const stream = subscriber.subscribe();
    stream.pipe(testStream);
    for (const event of events) {
      subscriber.publish(event);
    }

    assert.lengthOf(testStream.events, events.length);
    for (let i = 0; i < events.length; i++) {
      assert.deepStrictEqual(testStream.events[i], events[i]);
    }
    subscriber.unsubscribe(stream);
    testStream.end();
  });
});
