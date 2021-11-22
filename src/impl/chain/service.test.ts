import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { impl, ImplOption } from ".";
import * as crypto from "crypto";
import {
  Event,
  RoundStartedEvent,
  TaskCreatedEvent,
  PartnerSelectedEvent,
  CalculationStartedEvent,
  AggregationStartedEvent,
  RoundEndedEvent,
} from "..";
import { Readable } from "stream";

chai.use(chaiAsPromised);

const assert = chai.assert;

describe("chain service", function () {
  const opt: ImplOption = {
    contractAddress: "0xA7E337B441190057D8974c47f93A929aB302dA91",
    nodeAddress: "0x29E369a0eCdB439d3e42C955134ff4DF1894b32b",
    privateKey: "0x90a7f38ec7d0c2ab9b1302d0d99b485dc31e3dace206860258b5fe8f696b21ad",
    provider: "http://127.0.0.1:8545",
    abiFile: "DeltaContract.json",
    gasPrice: 1,
    gasLimit: 6721975,
    chainParam: {
      chainId: 1337,
    },
  };

  let stream: Readable;
  const events: Event[] = [];
  before(async function () {
    await impl.init(opt);
    stream = impl.subscribe();
    stream.on("data", (event: Event) => {
      events.push(event);
    });
  });

  after(function () {
    impl.unsubscribe(stream);
  });

  let taskID: string;
  const taskCommitment = "0x" + crypto.randomBytes(32).toString("hex");
  describe("createTask", function () {
    it("create first task", async function () {
      taskID = await impl.createTask(opt.nodeAddress, "mnist", taskCommitment);
      assert.strictEqual(taskID.slice(0, 2), "0x");
      assert.lengthOf(taskID, 66);
    });
  });

  const round = 1;
  describe("startRound", function () {
    it("start round 1", async function () {
      await impl.startRound(opt.nodeAddress, taskID, round);
    });
  });

  const pk1 = "0x" + crypto.randomBytes(32).toString("hex");
  const pk2 = "0x" + crypto.randomBytes(32).toString("hex");
  describe("joinRound", function () {
    it("join round 1", async function () {
      await impl.joinRound(opt.nodeAddress, taskID, round, pk1, pk2);
    });
  });

  describe("getTaskRound", function () {
    it("getTaskRound 1", async function () {
      const info = await impl.getTaskRound(taskID, round);
      assert.strictEqual(info.round, 1);
      assert.include(info.clients, opt.nodeAddress);
      assert.lengthOf(info.clients, 1);
      assert.strictEqual(info.status, 0);
    });
  });

  describe("selectCandidates", function () {
    it("selectCandidates", async function () {
      await impl.selectCandidates(opt.nodeAddress, taskID, round, [opt.nodeAddress]);
      assert.isRejected(
        impl.selectCandidates(opt.nodeAddress, taskID, round, [
          opt.nodeAddress,
          "0x8Caf33d112b4695f630c2E80E41Fc0336470b3b1",
        ])
      );

      const info = await impl.getTaskRound(taskID, round);
      assert.strictEqual(info.status, 1);
    });
  });

  const seedCommitment = "0x" + crypto.randomBytes(32).toString("hex");
  describe("uploadSeedCommitment", function () {
    it("uploadSeedCommitment", async function () {
      await impl.uploadSeedCommitment(opt.nodeAddress, taskID, round, opt.nodeAddress, seedCommitment);
    });
  });

  const secretKeyCommitment = "0x" + crypto.randomBytes(32).toString("hex");
  describe("uploadSecretKeyCommitment", function () {
    it("uploadSecretKeyCommitment", async function () {
      await impl.uploadSecretKeyCommitment(
        opt.nodeAddress,
        taskID,
        round,
        opt.nodeAddress,
        secretKeyCommitment
      );
    });
  });

  describe("getClientPublickKeys", function () {
    it("getClientPublickKeys", async function () {
      const [recvPK1, recvPK2] = await impl.getClientPublickKeys(taskID, round, opt.nodeAddress);
      assert.strictEqual(recvPK1, pk1);
      assert.strictEqual(recvPK2, pk2);
    });
  });

  describe("startCalculation", function () {
    it("startCalculation", async function () {
      await impl.startCalculation(opt.nodeAddress, taskID, round, [opt.nodeAddress]);
      assert.isRejected(
        impl.startCalculation(opt.nodeAddress, taskID, round, [
          opt.nodeAddress,
          "0x8Caf33d112b4695f630c2E80E41Fc0336470b3b1",
        ])
      );

      const info = await impl.getTaskRound(taskID, round);
      assert.strictEqual(info.status, 2);
    });
  });

  const resultCommitment = "0x" + crypto.randomBytes(32).toString("hex");
  describe("resultCommitment", function () {
    it("upload and get resultCommitment", async function () {
      await impl.uploadResultCommitment(opt.nodeAddress, taskID, round, resultCommitment);
      const cm = await impl.getResultCommitment(taskID, round, opt.nodeAddress);
      assert.strictEqual(cm, resultCommitment);
    });
  });

  describe("startAggregation", function () {
    it("startAggregation", async function () {
      await impl.startAggregation(opt.nodeAddress, taskID, round, [opt.nodeAddress]);
      assert.isRejected(
        impl.startAggregation(opt.nodeAddress, taskID, round, [
          opt.nodeAddress,
          "0x8Caf33d112b4695f630c2E80E41Fc0336470b3b1",
        ])
      );

      const info = await impl.getTaskRound(taskID, round);
      assert.strictEqual(info.status, 3);
    });
  });

  const seed = "0x" + crypto.randomBytes(32).toString("hex");
  describe("uploadSeed", function () {
    it("uploadSeed", async function () {
      await impl.uploadSeed(opt.nodeAddress, taskID, round, opt.nodeAddress, seed);
    });
  });

  const secretKey = "0x" + crypto.randomBytes(32).toString("hex");
  describe("uploadSecretKey", function () {
    it("uploadSecretKey", async function () {
      await impl.uploadSecretKey(opt.nodeAddress, taskID, round, opt.nodeAddress, secretKey);
    });
  });

  describe("getSecretShareData", function () {
    it("getSecretShareData", async function () {
      const data = await impl.getSecretShareData(taskID, round, opt.nodeAddress, opt.nodeAddress);
      assert.strictEqual(data.seed, seed);
      assert.strictEqual(data.seedCommitment, seedCommitment);
      assert.strictEqual(data.secretKey, secretKey);
      assert.strictEqual(data.secretKeyCommitment, secretKeyCommitment);
    });
  });

  describe("endRound", function () {
    it("endRound", async function () {
      await impl.endRound(opt.nodeAddress, taskID, round);

      const info = await impl.getTaskRound(taskID, round);
      assert.strictEqual(info.round, 1);
      assert.strictEqual(info.status, 4);
    });
  });

  describe("subscribe", function () {
    it("events", function () {
      assert.lengthOf(events, 6);
      assert.strictEqual(events[0].type, "TaskCreated");
      const event0 = events[0] as TaskCreatedEvent;
      assert.strictEqual(event0.address, opt.nodeAddress);
      assert.strictEqual(event0.taskID, taskID);
      assert.strictEqual(event0.dataset, "mnist");
      assert.strictEqual(event0.commitment, taskCommitment);

      assert.strictEqual(events[1].type, "RoundStarted");
      const event1 = events[1] as RoundStartedEvent;
      assert.strictEqual(event1.taskID, taskID);
      assert.strictEqual(event1.round, round);

      assert.strictEqual(events[2].type, "PartnerSelected");
      const event2 = events[2] as PartnerSelectedEvent;
      assert.strictEqual(event2.taskID, taskID);
      assert.strictEqual(event2.round, round);
      assert.lengthOf(event2.addrs, 1);
      assert.include(event2.addrs, opt.nodeAddress);

      assert.strictEqual(events[3].type, "CalculationStarted");
      const event3 = events[3] as CalculationStartedEvent;
      assert.strictEqual(event3.taskID, taskID);
      assert.strictEqual(event3.round, round);
      assert.lengthOf(event3.addrs, 1);
      assert.include(event3.addrs, opt.nodeAddress);

      assert.strictEqual(events[4].type, "AggregationStarted");
      const event4 = events[4] as AggregationStartedEvent;
      assert.strictEqual(event4.taskID, taskID);
      assert.strictEqual(event4.round, round);
      assert.lengthOf(event4.addrs, 1);
      assert.include(event4.addrs, opt.nodeAddress);

      assert.strictEqual(events[5].type, "RoundEnded");
      const event5 = events[5] as RoundEndedEvent;
      assert.strictEqual(event5.taskID, taskID);
      assert.strictEqual(event5.round, round);
    });
  });
});
