import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import * as crypto from "crypto";
import ganache from "ganache";
import path from "path";
import { Readable } from "stream";
import { ContractOption } from "./contract";
import { horizontal } from "./horizontal";
import { identity } from "./identity";

chai.use(chaiAsPromised);

const assert = chai.assert;

describe("ethereum horizontal", function () {
  this.timeout(0);
  const nodeAddress = "0x6578aDabE867C4F7b2Ce4c59aBEAbDC754fBb990";
  const privateKey = "f0f239a0cc63b338e4633cec4aaa3b705a4531d45ef0cbcc7ba0a4b993a952f2";
  const provider = ganache.provider({ wallet: { seed: "delta" } });

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
  const serverUrl = "127.0.0.1:6700";
  const serverName = "first";

  before(async function () {
    await identity.init(identityOpt);
    hflOpt.deployArgs = [identity.contract.option.contractAddress];
    await horizontal.init(hflOpt);
    stream = horizontal.subscribe(nodeAddress);
    await identity.join(serverUrl, serverName);
  });

  after(async function () {
    horizontal.unsubscribe(stream);
    await identity.leave(nodeAddress);
  });

  let taskID: string;
  const taskCommitment = "0x" + crypto.randomBytes(32).toString("hex");
  const taskType = "horizontal";
  it("create first task", async function () {
    const res = await horizontal.createTask(nodeAddress, "mnist", taskCommitment, taskType);
    taskID = res[1];
    assert.strictEqual(taskID.slice(0, 2), "0x");
    assert.lengthOf(taskID, 66);
    const event = stream.read();
    assert.strictEqual(event.address, nodeAddress);
    assert.strictEqual(event.taskID, taskID);
    assert.strictEqual(event.dataset, "mnist");
    assert.strictEqual(event.commitment, taskCommitment);
    assert.strictEqual(event.taskType, taskType);
  });

  const round = 1;
  it("start round 1", async function () {
    await horizontal.startRound(nodeAddress, taskID, round);
    const event = stream.read();
    assert.strictEqual(event.taskID, taskID);
    assert.strictEqual(event.round, round);
  });

  const pk1 = "0x" + crypto.randomBytes(32).toString("hex");
  const pk2 = "0x" + crypto.randomBytes(32).toString("hex");
  it("join round 1", async function () {
    await horizontal.joinRound(nodeAddress, taskID, round, pk1, pk2);
  });

  it("getTaskRound 1", async function () {
    const info = await horizontal.getTaskRound(taskID, round);
    assert.strictEqual(info.round, 1);
    assert.include(info.clients, nodeAddress);
    assert.lengthOf(info.clients, 1);
    assert.strictEqual(info.status, 0);
  });

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

    const event = stream.read();
    assert.strictEqual(event.taskID, taskID);
    assert.strictEqual(event.round, round);
    assert.lengthOf(event.addrs, 1);
    assert.include(event.addrs, nodeAddress);
  });

  const seedCommitment = "0x" + crypto.randomBytes(32).toString("hex");
  it("uploadSeedCommitment", async function () {
    await horizontal.uploadSeedCommitment(nodeAddress, taskID, round, [nodeAddress], [seedCommitment]);
  });

  const secretKeyCommitment = "0x" + crypto.randomBytes(32).toString("hex");
  it("uploadSecretKeyCommitment", async function () {
    await horizontal.uploadSecretKeyCommitment(
      nodeAddress,
      taskID,
      round,
      [nodeAddress],
      [secretKeyCommitment]
    );
  });

  it("getClientPublickKeys", async function () {
    const pks = await horizontal.getClientPublicKeys(taskID, round, [nodeAddress]);
    assert.lengthOf(pks, 1);
    assert.strictEqual(pks[0][0], pk1);
    assert.strictEqual(pks[0][1], pk2);
  });

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

    const event = stream.read();
    assert.strictEqual(event.taskID, taskID);
    assert.strictEqual(event.round, round);
    assert.lengthOf(event.addrs, 1);
    assert.include(event.addrs, nodeAddress);
  });

  const resultCommitment = "0x" + crypto.randomBytes(32).toString("hex");
  it("upload and get resultCommitment", async function () {
    await horizontal.uploadResultCommitment(nodeAddress, taskID, round, resultCommitment);
    const cm = await horizontal.getResultCommitment(taskID, round, nodeAddress);
    assert.strictEqual(cm, resultCommitment);
  });

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

    const event = stream.read();
    assert.strictEqual(event.taskID, taskID);
    assert.strictEqual(event.round, round);
    assert.lengthOf(event.addrs, 1);
    assert.include(event.addrs, nodeAddress);
  });

  const seed = "0x" + crypto.randomBytes(32).toString("hex");
  it("uploadSeed", async function () {
    await horizontal.uploadSeed(nodeAddress, taskID, round, [nodeAddress], [seed]);
  });

  const secretKey = "0x" + crypto.randomBytes(32).toString("hex");
  it("uploadSecretKey", async function () {
    await horizontal.uploadSecretKey(nodeAddress, taskID, round, [nodeAddress], [secretKey]);
  });

  it("getSecretShareData", async function () {
    const datas = await horizontal.getSecretShareDatas(taskID, round, [nodeAddress], nodeAddress);
    assert.strictEqual(datas[0].seed, seed);
    assert.strictEqual(datas[0].seedCommitment, seedCommitment);
    assert.strictEqual(datas[0].secretKey, secretKey);
    assert.strictEqual(datas[0].secretKeyCommitment, secretKeyCommitment);
  });

  it("endRound", async function () {
    await horizontal.endRound(nodeAddress, taskID, round);

    const info = await horizontal.getTaskRound(taskID, round);
    assert.strictEqual(info.round, 1);
    assert.strictEqual(info.status, 4);

    const event = stream.read();
    assert.strictEqual(event.taskID, taskID);
    assert.strictEqual(event.round, round);
  });

  it("finishTask", async function () {
    await horizontal.finishTask(nodeAddress, taskID);

    const info = await horizontal.getTask(taskID);
    assert.isTrue(info.finished);

    const event = stream.read();
    assert.strictEqual(event.taskID, taskID);
  });
});
