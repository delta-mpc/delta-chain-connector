import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import ganache from "ganache";
import path from "path";
import { Readable } from "stream";
import { randomHex } from "~/utils";
import { ContractHelper, ContractOption } from "./contract";
import { datahub } from "./datahub";
import { hlr, HLRContractOption } from "./hlr";
import { identity } from "./identity";

chai.use(chaiAsPromised);

const assert = chai.assert;

describe("ethereum hlr", function () {
  this.timeout(0);
  const nodeAddress = "0x6578aDabE867C4F7b2Ce4c59aBEAbDC754fBb990";
  const privateKey = "f0f239a0cc63b338e4633cec4aaa3b705a4531d45ef0cbcc7ba0a4b993a952f2";
  const provider = ganache.provider({ wallet: { seed: "delta" } });

  const datahubOpt: ContractOption = {
    nodeAddress: nodeAddress,
    privateKey: privateKey,
    provider: provider,
    gasPrice: 20000000000,
    gasLimit: 6721975,
    chainParam: {
      chainId: 1337,
    },
    abiFile: path.resolve(__dirname + "/../contract/DataHub.json"),
  };

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

  const verifier3Opt: ContractOption = {
    nodeAddress: nodeAddress,
    privateKey: privateKey,
    provider: provider,
    gasPrice: 20000000000,
    gasLimit: 6721975,
    chainParam: {
      chainId: 1337,
    },
    abiFile: path.resolve(__dirname + "/../contract/PlonkVerifier3.json"),
  };

  const hflOpt: HLRContractOption = {
    nodeAddress: nodeAddress,
    privateKey: privateKey,
    provider: provider,
    gasPrice: 20000000000,
    gasLimit: 6721975,
    chainParam: {
      chainId: 1337,
    },
    abiFile: path.resolve(__dirname + "/../contract/HLR.json"),
    verifiers: {},
  };

  let stream: Readable;
  const serverUrl = "127.0.0.1:6700";
  const serverName = "first";

  before(async function () {
    await datahub.init(datahubOpt);
    await identity.init(identityOpt);
    const verifierContract = new ContractHelper(verifier3Opt);
    await verifierContract.init();
    hflOpt.deployArgs = [identity.contract.option.contractAddress, datahub.contract.option.contractAddress];
    if (verifier3Opt.contractAddress) {
      hflOpt.verifiers[3] = verifier3Opt.contractAddress;
    } else {
      throw new Error("verifier3Opt is undifined");
    }
    await hlr.init(hflOpt);
    stream = hlr.subscribe(nodeAddress);
    await identity.join(serverUrl, serverName);
    await datahub.register(
      nodeAddress,
      "mnist",
      0,
      "0x1b9e1999bd3aede0f518ac01efbbc4c6397f311f8fb1b4d9a789b92440e87790"
    );
  });

  after(async function () {
    hlr.unsubscribe(stream);
    await identity.leave(nodeAddress);
  });

  let taskID: string;
  const taskCommitment = randomHex(32);
  const taskType = "hlr";
  const enableVerify = true;
  const tolerance = 6;
  it("create first task", async function () {
    const res = await hlr.createTask(nodeAddress, "mnist", taskCommitment, enableVerify, tolerance);
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
  const weightCommitment = "0x09ea9ed6d70cd296187459b9256c3f290565ccedc317f96f539bc46df73cda92";

  it("start round 1", async function () {
    await hlr.startRound(nodeAddress, taskID, round, weightCommitment);
    const event = stream.read();
    assert.strictEqual(event.taskID, taskID);
    assert.strictEqual(event.round, round);
  });

  it("check weight commitment", async () => {
    const _commitment = await hlr.getWeightCommitment(taskID, round);
    assert.strictEqual(_commitment, weightCommitment);
  });

  const pk1 = randomHex(32);
  const pk2 = randomHex(32);
  it("join round 1", async function () {
    await hlr.joinRound(nodeAddress, taskID, round, pk1, pk2);
  });

  it("getTaskRound 1", async function () {
    const info = await hlr.getTaskRound(taskID, round);
    assert.strictEqual(info.round, 1);
    assert.include(info.joinedClients, nodeAddress);
    assert.lengthOf(info.joinedClients, 1);
    assert.strictEqual(info.status, 0);
    assert.lengthOf(info.finishedClients, 0);
  });

  it("selectCandidates", async function () {
    await hlr.selectCandidates(nodeAddress, taskID, round, [nodeAddress]);
    await assert.isRejected(
      hlr.selectCandidates(nodeAddress, taskID, round, [
        nodeAddress,
        "0x8Caf33d112b4695f630c2E80E41Fc0336470b3b1",
      ])
    );

    const info = await hlr.getTaskRound(taskID, round);
    assert.strictEqual(info.status, 1);

    const event = stream.read();
    assert.strictEqual(event.taskID, taskID);
    assert.strictEqual(event.round, round);
    assert.lengthOf(event.addrs, 1);
    assert.include(event.addrs, nodeAddress);
  });

  const seedCommitment = randomHex(32);
  it("uploadSeedCommitment", async function () {
    await hlr.uploadSeedCommitment(nodeAddress, taskID, round, [nodeAddress], [seedCommitment]);
  });

  const secretKeyCommitment = randomHex(32);
  it("uploadSecretKeyCommitment", async function () {
    await hlr.uploadSecretKeyCommitment(nodeAddress, taskID, round, [nodeAddress], [secretKeyCommitment]);
  });

  it("getClientPublickKeys", async function () {
    const pks = await hlr.getClientPublicKeys(taskID, round, [nodeAddress]);
    assert.lengthOf(pks, 1);
    assert.strictEqual(pks[0][0], pk1);
    assert.strictEqual(pks[0][1], pk2);
  });

  it("startCalculation", async function () {
    await hlr.startCalculation(nodeAddress, taskID, round, [nodeAddress]);
    await assert.isRejected(
      hlr.startCalculation(nodeAddress, taskID, round, [
        nodeAddress,
        "0x8Caf33d112b4695f630c2E80E41Fc0336470b3b1",
      ])
    );

    const info = await hlr.getTaskRound(taskID, round);
    assert.strictEqual(info.status, 2);

    const event = stream.read();
    assert.strictEqual(event.taskID, taskID);
    assert.strictEqual(event.round, round);
    assert.lengthOf(event.addrs, 1);
    assert.include(event.addrs, nodeAddress);
  });

  const resultCommitment = randomHex(32);
  it("upload and get resultCommitment", async function () {
    await hlr.uploadResultCommitment(nodeAddress, taskID, round, resultCommitment);
    const cm = await hlr.getResultCommitment(taskID, round, nodeAddress);
    assert.strictEqual(cm, resultCommitment);
  });

  it("startAggregation", async function () {
    await hlr.startAggregation(nodeAddress, taskID, round, [nodeAddress]);
    await assert.isRejected(
      hlr.startAggregation(nodeAddress, taskID, round, [
        nodeAddress,
        "0x8Caf33d112b4695f630c2E80E41Fc0336470b3b1",
      ])
    );

    const info = await hlr.getTaskRound(taskID, round);
    assert.strictEqual(info.status, 3);

    const event = stream.read();
    assert.strictEqual(event.taskID, taskID);
    assert.strictEqual(event.round, round);
    assert.lengthOf(event.addrs, 1);
    assert.include(event.addrs, nodeAddress);
  });

  const seed = randomHex(32);
  it("uploadSeed", async function () {
    await hlr.uploadSeed(nodeAddress, taskID, round, [nodeAddress], [seed]);
  });

  const secretKey = randomHex(32);
  it("uploadSecretKey", async function () {
    await hlr.uploadSecretKey(nodeAddress, taskID, round, [nodeAddress], [secretKey]);
  });

  it("getSecretShareData", async function () {
    const datas = await hlr.getSecretShareDatas(taskID, round, [nodeAddress], nodeAddress);
    assert.strictEqual(datas[0].seed, seed);
    assert.strictEqual(datas[0].seedCommitment, seedCommitment);
    assert.strictEqual(datas[0].secretKey, secretKey);
    assert.strictEqual(datas[0].secretKeyCommitment, secretKeyCommitment);
  });

  it("endRound", async function () {
    await hlr.endRound(nodeAddress, taskID, round);

    const info = await hlr.getTaskRound(taskID, round);
    assert.strictEqual(info.round, 1);
    assert.strictEqual(info.status, 4);

    const event = stream.read();
    assert.strictEqual(event.taskID, taskID);
    assert.strictEqual(event.round, round);
  });

  it("finishTask", async function () {
    await hlr.finishTask(nodeAddress, taskID);

    const info = await hlr.getTask(taskID);
    assert.isTrue(info.finished);

    const event = stream.read();
    assert.strictEqual(event.taskID, taskID);
  });

  const proof =
    "{\"A\":[\"636263409642223480755202506638931949375986131692717851857258308190530345326\",\"3458166464521518318248967484557553570159238134090644197643926714109574042932\",\"1\"],\"B\":[\"14362586937602535814816823496985574360269467705227751911961015587656944948083\",\"1870620977389133455253816535345976517130532597691250104906065470129588350120\",\"1\"],\"C\":[\"18954541704309916040148652646335478583861155457345473439643061773104903810248\",\"13664293841463047803872783542454630100774207583451843726772602648738914608595\",\"1\"],\"Z\":[\"14749978331526011815543264205861361632624185274345833155767367110081325786792\",\"21249511926596568465274108576891414111830507942957030375018835529475321428875\",\"1\"],\"T1\":[\"7181157147208144283611167454066297144944141619789892715375833966149251924799\",\"4260460871613446379187866385285753935617339590991362801611692341679983890271\",\"1\"],\"T2\":[\"3013255070272528442566986847471590750638067260181241811920783941478585829677\",\"3023576744162355144559140787496505103014134281023991682400197778517716110101\",\"1\"],\"T3\":[\"16012144006274061429352636468965994654407264487927925309709095205269370823369\",\"2414695899212897788171871583946359249504526384995686713923732734864250063841\",\"1\"],\"eval_a\":\"13301639695968749561235390383633865826171532168089467079500126385009181431809\",\"eval_b\":\"15698999220889832822174817004790052405753361649565587529229026309890841979995\",\"eval_c\":\"1835434663319944499369926979451853223238647503891906722714108222860394001226\",\"eval_s1\":\"15381887482378061156033203087720242647578585121796569119915935212952127612774\",\"eval_s2\":\"10298249318421057064492178076544439958096078088122025717723938505045913912138\",\"eval_zw\":\"1075182852359312608839765494621622851108123872093631717655984591450492764423\",\"eval_r\":\"19922321998626883430598586253357083029674759223177760170909215199869805604271\",\"Wxi\":[\"15175945916337081668609561261549156520831324477974389284775681172043139897251\",\"4459935903798911969757623578487967899666407156829131324391968101404929508871\",\"1\"],\"Wxiw\":[\"15861756358030334766990188818995173244254089501947528941883220354753815467096\",\"15958868884643683813190873244625119479193175861084626962762340137214113278956\",\"1\"],\"protocol\":\"plonk\",\"curve\":\"bn128\"}";
  const pubSignals = [
    "45191926979062500000000000000",
    "29",
    "267591953685000000000000000000",
    "29",
    "0",
    "29",
    "4485354118406336729363675711000348342713746016780773923827638902243253344914",
    "12491785436441952246131977283207663900873480131562437076931999384071026800528",
  ];

  it("verify", async () => {
    const [, valid] = await hlr.verify(nodeAddress, taskID, 3, proof, pubSignals, 0, 10);
    assert.isTrue(valid);

    const event = stream.read();
    assert.strictEqual(event.taskID, taskID);
    assert.strictEqual(event.address, nodeAddress);
    assert.isTrue(event.verified);
  });

  it("get verifier state", async () => {
    const state = await hlr.getVerifierState(taskID);

    assert.lengthOf(state.invalidClients, 0);
    assert.lengthOf(state.unfinishedClients, 0);
    assert.isTrue(state.valid);
    assert.isNotTrue(state.confirmed);
  });

  it("confirm verification", async () => {
    await hlr.confirmVerification(nodeAddress, taskID);
    const event = stream.read();
    assert.strictEqual(event.taskID, taskID);

    const state = await hlr.getVerifierState(taskID);
    assert.isTrue(state.confirmed);
  });
});
