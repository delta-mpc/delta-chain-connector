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

    const stream = subscriber.subscribe(address);
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
});
