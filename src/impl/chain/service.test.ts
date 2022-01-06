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
  TaskFinishedEvent,
} from "..";
import { Readable } from "stream";

chai.use(chaiAsPromised);

const assert = chai.assert;

describe("chain service", function () {
  const nodeAddress = "0x9dA1E0CcB6C9848Ad1088B96415CB845a8392794";
  const privateKey = "0x38a95092ac564590f75679db5beda49148e59498337cf4a17bb017ce42363ba3";

  const identityOpt: ContractOption = {
    contractAddress: "0xC282D87859a55B19446fE352a1b338391249eF57",
    abiFile: "IdentityContract.json",
  };

  const hflOpt: ContractOption = {
    contractAddress: "0xe9e00f59C88845cf9a211665E7413586fC2d8C90",
    abiFile: "HFLContract.json",
  };

  const opt: ChainOption = {
    nodeAddress: nodeAddress,
    privateKey: privateKey,
    provider: "http://127.0.0.1:8545",
    gasPrice: 1,
    gasLimit: 6721975,
    chainParam: {
      chainId: 1337,
    },

    identity: identityOpt,
    hfl: hflOpt,
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

  const serverUrl = "127.0.0.1:6700";
  const serverName = "first";
  describe("node join", function () {
    it("join and get", async function () {
      /* eslint-disable  @typescript-eslint/no-unused-vars */
      const [_, address] = await impl.join(serverUrl, serverName);
      /* eslint-enable  @typescript-eslint/no-unused-vars */
      assert.strictEqual(address, nodeAddress);

      const info = await impl.getNodeInfo(address);
      assert.strictEqual(info.url, serverUrl);
      assert.strictEqual(info.name, serverName);
    });
  });

  describe("get nodes", function () {
    it("get nodes", async function () {
      const nodes = await impl.getNodes(1, 20);
      assert.strictEqual(nodes.totalCount, 1);
      assert.strictEqual(nodes.nodes[0].address, nodeAddress);
      assert.strictEqual(nodes.nodes[0].url, serverUrl);
      assert.strictEqual(nodes.nodes[0].name, serverName);
    });
  });

  let taskID: string;
  const taskCommitment = "0x" + crypto.randomBytes(32).toString("hex");
  const taskType = "horizontal";
  describe("createTask", function () {
    it("create first task", async function () {
      const res = await impl.createTask(nodeAddress, "mnist", taskCommitment, taskType);
      taskID = res[1];
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
      await impl.uploadSeedCommitment(nodeAddress, taskID, round, [nodeAddress], [seedCommitment]);
    });
  });

  const secretKeyCommitment = "0x" + crypto.randomBytes(32).toString("hex");
  describe("uploadSecretKeyCommitment", function () {
    it("uploadSecretKeyCommitment", async function () {
      await impl.uploadSecretKeyCommitment(nodeAddress, taskID, round, [nodeAddress], [secretKeyCommitment]);
    });
  });

  describe("getClientPublickKeys", function () {
    it("getClientPublickKeys", async function () {
      const pks = await impl.getClientPublickKeys(taskID, round, [nodeAddress]);
      assert.lengthOf(pks, 1);
      assert.strictEqual(pks[0][0], pk1);
      assert.strictEqual(pks[0][1], pk2);
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
      await impl.uploadSeed(nodeAddress, taskID, round, [nodeAddress], [seed]);
    });
  });

  const secretKey = "0x" + crypto.randomBytes(32).toString("hex");
  describe("uploadSecretKey", function () {
    it("uploadSecretKey", async function () {
      await impl.uploadSecretKey(nodeAddress, taskID, round, [nodeAddress], [secretKey]);
    });
  });

  describe("getSecretShareData", function () {
    it("getSecretShareData", async function () {
      const datas = await impl.getSecretShareDatas(taskID, round, [nodeAddress], nodeAddress);
      assert.strictEqual(datas[0].seed, seed);
      assert.strictEqual(datas[0].seedCommitment, seedCommitment);
      assert.strictEqual(datas[0].secretKey, secretKey);
      assert.strictEqual(datas[0].secretKeyCommitment, secretKeyCommitment);
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

  describe("finishTask", function () {
    it("finishTask", async function () {
      await impl.finishTask(nodeAddress, taskID);

      const info = await impl.getTask(taskID);
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
