import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { impl, ChainOption, ContractOption } from ".";
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
  const identityOpt: ContractOption = {
    contractAddress: "0x8665E1047287352f958dd926391752694D416519",
    nodeAddress: "0xA3537C2586322A4B443327B2b2e1505fdCa8EADE",
    privateKey: "0x9ef421a93c8b6c01145147bfbef7444ed6f5b2fe5e99bdbbaaf5f6f21f238c7b",
    provider: "http://127.0.0.1:8545",
    abiFile: "IdentityContract.json",
    gasPrice: 1,
    gasLimit: 6721975,
    chainParam: {
      chainId: 1337,
    },
  };

  const deltaOpt: ContractOption = {
    contractAddress: "0x69AB89d460F8f0F39302D98cb5f71f412259E4D2",
    nodeAddress: "0xA3537C2586322A4B443327B2b2e1505fdCa8EADE",
    privateKey: "0x9ef421a93c8b6c01145147bfbef7444ed6f5b2fe5e99bdbbaaf5f6f21f238c7b",
    provider: "http://127.0.0.1:8545",
    abiFile: "DeltaContract.json",
    gasPrice: 1,
    gasLimit: 6721975,
    chainParam: {
      chainId: 1337,
    },
  };

  const opt: ChainOption = {
    identity: identityOpt,
    delta: deltaOpt,
  };

  const nodeAddress = "0xA3537C2586322A4B443327B2b2e1505fdCa8EADE";

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

  const serverUrl = "127.0.0.1:6700";
  const serverName = "first";
  describe("node join", function () {
    it("join and get", async function () {
      const address = await impl.join(serverUrl, serverName);
      assert.strictEqual(address, nodeAddress);

      const info = await impl.getNodeInfo(address);
      assert.strictEqual(info.url, serverUrl);
      assert.strictEqual(info.name, serverName);
    });
  });

  let taskID: string;
  const taskCommitment = "0x" + crypto.randomBytes(32).toString("hex");
  describe("createTask", function () {
    it("create first task", async function () {
      taskID = await impl.createTask(nodeAddress, "mnist", taskCommitment);
      assert.strictEqual(taskID.slice(0, 2), "0x");
      assert.lengthOf(taskID, 66);
    });
  });

  const round = 1;
  describe("startRound", function () {
    it("start round 1", async function () {
      await impl.startRound(nodeAddress, taskID, round);
    });
  });

  const pk1 = "0x" + crypto.randomBytes(32).toString("hex");
  const pk2 = "0x" + crypto.randomBytes(32).toString("hex");
  describe("joinRound", function () {
    it("join round 1", async function () {
      await impl.joinRound(nodeAddress, taskID, round, pk1, pk2);
    });
  });

  describe("getTaskRound", function () {
    it("getTaskRound 1", async function () {
      const info = await impl.getTaskRound(taskID, round);
      assert.strictEqual(info.round, 1);
      assert.include(info.clients, nodeAddress);
      assert.lengthOf(info.clients, 1);
      assert.strictEqual(info.status, 0);
    });
  });

  describe("selectCandidates", function () {
    it("selectCandidates", async function () {
      await impl.selectCandidates(nodeAddress, taskID, round, [nodeAddress]);
      assert.isRejected(
        impl.selectCandidates(nodeAddress, taskID, round, [
          nodeAddress,
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
      await impl.uploadSeedCommitment(nodeAddress, taskID, round, nodeAddress, seedCommitment);
    });
  });

  const secretKeyCommitment = "0x" + crypto.randomBytes(32).toString("hex");
  describe("uploadSecretKeyCommitment", function () {
    it("uploadSecretKeyCommitment", async function () {
      await impl.uploadSecretKeyCommitment(nodeAddress, taskID, round, nodeAddress, secretKeyCommitment);
    });
  });

  describe("getClientPublickKeys", function () {
    it("getClientPublickKeys", async function () {
      const [recvPK1, recvPK2] = await impl.getClientPublickKeys(taskID, round, nodeAddress);
      assert.strictEqual(recvPK1, pk1);
      assert.strictEqual(recvPK2, pk2);
    });
  });

  describe("startCalculation", function () {
    it("startCalculation", async function () {
      await impl.startCalculation(nodeAddress, taskID, round, [nodeAddress]);
      assert.isRejected(
        impl.startCalculation(nodeAddress, taskID, round, [
          nodeAddress,
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
      await impl.uploadResultCommitment(nodeAddress, taskID, round, resultCommitment);
      const cm = await impl.getResultCommitment(taskID, round, nodeAddress);
      assert.strictEqual(cm, resultCommitment);
    });
  });

  describe("startAggregation", function () {
    it("startAggregation", async function () {
      await impl.startAggregation(nodeAddress, taskID, round, [nodeAddress]);
      assert.isRejected(
        impl.startAggregation(nodeAddress, taskID, round, [
          nodeAddress,
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
      await impl.uploadSeed(nodeAddress, taskID, round, nodeAddress, seed);
    });
  });

  const secretKey = "0x" + crypto.randomBytes(32).toString("hex");
  describe("uploadSecretKey", function () {
    it("uploadSecretKey", async function () {
      await impl.uploadSecretKey(nodeAddress, taskID, round, nodeAddress, secretKey);
    });
  });

  describe("getSecretShareData", function () {
    it("getSecretShareData", async function () {
      const data = await impl.getSecretShareData(taskID, round, nodeAddress, nodeAddress);
      assert.strictEqual(data.seed, seed);
      assert.strictEqual(data.seedCommitment, seedCommitment);
      assert.strictEqual(data.secretKey, secretKey);
      assert.strictEqual(data.secretKeyCommitment, secretKeyCommitment);
    });
  });

  describe("endRound", function () {
    it("endRound", async function () {
      await impl.endRound(nodeAddress, taskID, round);

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
      assert.strictEqual(event0.address, nodeAddress);
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
    });
  });

  const newServerUrl = "127.0.0.1:6701";
  const newServerName = "new";
  describe("node update and leave", function () {
    it("node update and leave", async function () {
      await impl.updateUrl(nodeAddress, newServerUrl);
      await impl.updateName(nodeAddress, newServerName);

      const info = await impl.getNodeInfo(nodeAddress);
      assert.strictEqual(info.url, newServerUrl);
      assert.strictEqual(info.name, newServerName);

      await impl.leave(nodeAddress);
    });
  });
});
