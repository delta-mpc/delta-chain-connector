import { assert } from "chai";
import { Event } from "./common";
import { Subscriber } from "./subscribe";

describe("Subscriber", function () {
  const address = "0x123";

  it("subscribe and publish", function () {
    const subscriber = new Subscriber();

    const events = [
      {
        type: "TaskCreated",
      },
      {
        type: "RoundStarted",
      },
      {
        type: "PartnerSelected",
      },
      {
        type: "CalculationStarted",
      },
      {
        type: "AggregationStarted",
      },
      {
        type: "RoundEnded",
      },
    ];

    const stream = subscriber.subscribe(address, 0);
    const subEvents: Event[] = [];
    stream.on("data", (e: Event) => {
      subEvents.push(e);
    });
    for (const event of events) {
      subscriber.publish(event);
    }

    assert.lengthOf(subEvents, events.length);
    for (let i = 0; i < events.length; i++) {
      assert.deepStrictEqual(subEvents[i], events[i]);
    }
    subscriber.unsubscribe(stream);
  });

  it("heartbeat", function (done) {
    this.timeout(3000);
    const subscriber = new Subscriber();
    const events: Event[] = [];
    const stream = subscriber.subscribe(address, 1);
    stream.on("data", (e: Event) => {
      events.push(e);
    });
    setTimeout(() => {
      assert.isAtLeast(events.length, 1);
      subscriber.unsubscribe(stream);
      done();
    }, 2000);
  });
});
