import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import * as crypto from "crypto";
import path from "path";
import { Readable } from "stream";
import {
  AggregationStartedEvent,
  CalculationStartedEvent, Event, PartnerSelectedEvent,
  RoundEndedEvent,
  RoundStartedEvent,
  TaskCreatedEvent,
  TaskFinishedEvent
} from "~/event";
import { ContractOption } from "./contract";
import { horizontal } from "./horizontal";
import { identity } from "./identity";
import ganache from "ganache";

chai.use(chaiAsPromised);

const assert = chai.assert;

describe("ethereum service", function () {
  this.timeout(0);
  const nodeAddress = "0x6578aDabE867C4F7b2Ce4c59aBEAbDC754fBb990";
  const privateKey = "f0f239a0cc63b338e4633cec4aaa3b705a4531d45ef0cbcc7ba0a4b993a952f2";
  const provider = ganache.provider({wallet: {seed: "delta"}});

  const identityOpt: ContractOption = {
    nodeAddress: nodeAddress,
    privateKey: privateKey,
    provider: provider,
    gasPrice: 20000000000,
    gasLimit: 6721975,
    chainParam: {
      chainId: 1337,
    },
    abiFile: path.resolve(__dirname + "/../contract/IdentityContract.json"),
  };

  const hflOpt: ContractOption = {
    nodeAddress: nodeAddress,
    privateKey: privateKey,
    provider: provider,
    gasPrice: 20000000000,
    gasLimit: 6721975,
    chainParam: {
      chainId: 1337,
    },
    abiFile: path.resolve(__dirname + "/../contract/HFLContract.json"),
  };

  let stream: Readable;
  const events: Event[] = [];
  const serverUrl = "127.0.0.1:6700";
  const serverName = "first";

  before(async function () {
    await identity.init(identityOpt);
    hflOpt.deployArgs = [identity.contract.option.contractAddress];
    await horizontal.init(hflOpt);
    stream = horizontal.subscribe(nodeAddress, 0);
    stream.on("data", (event: Event) => {
      console.log(event.type);
      events.push(event);
    });
    await identity.join(serverUrl, serverName);
  });

  after(async function () {
    horizontal.unsubscribe(stream);
    await identity.leave(nodeAddress);
  });

  let taskID: string;
  const taskCommitment = "0x" + crypto.randomBytes(32).toString("hex");
  const taskType = "horizontal";
  describe("createTask", function () {
    it("create first task", async function () {
      const res = await horizontal.createTask(nodeAddress, "mnist", taskCommitment, taskType);
      taskID = res[1];
      assert.strictEqual(taskID.slice(0, 2), "0x");
      assert.lengthOf(taskID, 66);
    });
  });

  const round = 1;
  describe("startRound", function () {
    it("start round 1", async function () {
      await horizontal.startRound(nodeAddress, taskID, round);
    });
  });

  const pk1 = "0x" + crypto.randomBytes(32).toString("hex");
  const pk2 = "0x" + crypto.randomBytes(32).toString("hex");
  describe("joinRound", function () {
    it("join round 1", async function () {
      await horizontal.joinRound(nodeAddress, taskID, round, pk1, pk2);
    });
  });

  describe("getTaskRound", function () {
    it("getTaskRound 1", async function () {
      const info = await horizontal.getTaskRound(taskID, round);
      assert.strictEqual(info.round, 1);
      assert.include(info.clients, nodeAddress);
      assert.lengthOf(info.clients, 1);
      assert.strictEqual(info.status, 0);
    });
  });

  describe("selectCandidates", function () {
    it("selectCandidates", async function () {
      await horizontal.selectCandidates(nodeAddress, taskID, round, [nodeAddress]);
      await assert.isRejected(
        horizontal.selectCandidates(nodeAddress, taskID, round, [
          nodeAddress,
          "0x8Caf33d112b4695f630c2E80E41Fc0336470b3b1",
        ])
      );

      const info = await horizontal.getTaskRound(taskID, round);
      assert.strictEqual(info.status, 1);
    });
  });

  const seedCommitment = "0x" + crypto.randomBytes(32).toString("hex");
  describe("uploadSeedCommitment", function () {
    it("uploadSeedCommitment", async function () {
      await horizontal.uploadSeedCommitment(nodeAddress, taskID, round, [nodeAddress], [seedCommitment]);
    });
  });

  const secretKeyCommitment = "0x" + crypto.randomBytes(32).toString("hex");
  describe("uploadSecretKeyCommitment", function () {
    it("uploadSecretKeyCommitment", async function () {
      await horizontal.uploadSecretKeyCommitment(
        nodeAddress,
        taskID,
        round,
        [nodeAddress],
        [secretKeyCommitment]
      );
    });
  });

  describe("getClientPublickKeys", function () {
    it("getClientPublickKeys", async function () {
      const pks = await horizontal.getClientPublickKeys(taskID, round, [nodeAddress]);
      assert.lengthOf(pks, 1);
      assert.strictEqual(pks[0][0], pk1);
      assert.strictEqual(pks[0][1], pk2);
    });
  });

  describe("startCalculation", function () {
    it("startCalculation", async function () {
      await horizontal.startCalculation(nodeAddress, taskID, round, [nodeAddress]);
      await assert.isRejected(
        horizontal.startCalculation(nodeAddress, taskID, round, [
          nodeAddress,
          "0x8Caf33d112b4695f630c2E80E41Fc0336470b3b1",
        ])
      );

      const info = await horizontal.getTaskRound(taskID, round);
      assert.strictEqual(info.status, 2);
    });
  });

  const resultCommitment = "0x" + crypto.randomBytes(32).toString("hex");
  describe("resultCommitment", function () {
    it("upload and get resultCommitment", async function () {
      await horizontal.uploadResultCommitment(nodeAddress, taskID, round, resultCommitment);
      const cm = await horizontal.getResultCommitment(taskID, round, nodeAddress);
      assert.strictEqual(cm, resultCommitment);
    });
  });

  describe("startAggregation", function () {
    it("startAggregation", async function () {
      await horizontal.startAggregation(nodeAddress, taskID, round, [nodeAddress]);
      await assert.isRejected(
        horizontal.startAggregation(nodeAddress, taskID, round, [
          nodeAddress,
          "0x8Caf33d112b4695f630c2E80E41Fc0336470b3b1",
        ])
      );

      const info = await horizontal.getTaskRound(taskID, round);
      assert.strictEqual(info.status, 3);
    });
  });

  const seed = "0x" + crypto.randomBytes(32).toString("hex");
  describe("uploadSeed", function () {
    it("uploadSeed", async function () {
      await horizontal.uploadSeed(nodeAddress, taskID, round, [nodeAddress], [seed]);
    });
  });

  const secretKey = "0x" + crypto.randomBytes(32).toString("hex");
  describe("uploadSecretKey", function () {
    it("uploadSecretKey", async function () {
      await horizontal.uploadSecretKey(nodeAddress, taskID, round, [nodeAddress], [secretKey]);
    });
  });

  describe("getSecretShareData", function () {
    it("getSecretShareData", async function () {
      const datas = await horizontal.getSecretShareDatas(taskID, round, [nodeAddress], nodeAddress);
      assert.strictEqual(datas[0].seed, seed);
      assert.strictEqual(datas[0].seedCommitment, seedCommitment);
      assert.strictEqual(datas[0].secretKey, secretKey);
      assert.strictEqual(datas[0].secretKeyCommitment, secretKeyCommitment);
    });
  });

  describe("endRound", function () {
    it("endRound", async function () {
      await horizontal.endRound(nodeAddress, taskID, round);

      const info = await horizontal.getTaskRound(taskID, round);
      assert.strictEqual(info.round, 1);
      assert.strictEqual(info.status, 4);
    });
  });

  describe("finishTask", function () {
    it("finishTask", async function () {
      await horizontal.finishTask(nodeAddress, taskID);

      const info = await horizontal.getTask(taskID);
      assert.isTrue(info.finished);
    });
  });

  describe("subscribe", function () {
    it("events", function () {
      assert.lengthOf(events, 7);
      assert.strictEqual(events[0].type, "TaskCreated");
      const event0 = events[0] as TaskCreatedEvent;
      assert.strictEqual(event0.address, nodeAddress);
      assert.strictEqual(event0.taskID, taskID);
      assert.strictEqual(event0.dataset, "mnist");
      assert.strictEqual(event0.commitment, taskCommitment);
      assert.strictEqual(event0.taskType, taskType);

      assert.strictEqual(events[1].type, "RoundStarted");
      const event1 = events[1] as RoundStartedEvent;
      assert.strictEqual(event1.taskID, taskID);
      assert.strictEqual(event1.round, round);

      assert.strictEqual(events[2].type, "PartnerSelected");
      const event2 = events[2] as PartnerSelectedEvent;
      assert.strictEqual(event2.taskID, taskID);
      assert.strictEqual(event2.round, round);
      assert.lengthOf(event2.addrs, 1);
      assert.include(event2.addrs, nodeAddress);

      assert.strictEqual(events[3].type, "CalculationStarted");
      const event3 = events[3] as CalculationStartedEvent;
      assert.strictEqual(event3.taskID, taskID);
      assert.strictEqual(event3.round, round);
      assert.lengthOf(event3.addrs, 1);
      assert.include(event3.addrs, nodeAddress);

      assert.strictEqual(events[4].type, "AggregationStarted");
      const event4 = events[4] as AggregationStartedEvent;
      assert.strictEqual(event4.taskID, taskID);
      assert.strictEqual(event4.round, round);
      assert.lengthOf(event4.addrs, 1);
      assert.include(event4.addrs, nodeAddress);

      assert.strictEqual(events[5].type, "RoundEnded");
      const event5 = events[5] as RoundEndedEvent;
      assert.strictEqual(event5.taskID, taskID);
      assert.strictEqual(event5.round, round);

      assert.strictEqual(events[6].type, "TaskFinished");
      const event6 = events[6] as TaskFinishedEvent;
      assert.strictEqual(event6.taskID, taskID);
    });
  });
});
