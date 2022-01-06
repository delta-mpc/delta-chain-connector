import { assert } from "chai";
import { Event, Subscriber } from "./event";

describe("Subscriber", function () {
  it("subscribe and publish", function () {
    const subscriber = new Subscriber();

    const events: Event[] = [
      {
        type: "TaskCreated",
        address: "1",
        taskID: "1",
        dataset: "1",
        url: "1",
        commitment: "1",
        taskType: "horizontal",
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
