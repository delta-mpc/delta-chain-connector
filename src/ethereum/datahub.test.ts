import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import path from "path";
import { ContractOption } from "./contract";
import { datahub } from "./datahub";
import ganache from "ganache";
import { Readable } from "stream";
import { DataRegisteredEvent } from "~/event";

chai.use(chaiAsPromised);

const assert = chai.assert;

describe("ethereum datahub", function () {
  this.timeout(0);
  const nodeAddress = "0x6578aDabE867C4F7b2Ce4c59aBEAbDC754fBb990";
  const privateKey = "f0f239a0cc63b338e4633cec4aaa3b705a4531d45ef0cbcc7ba0a4b993a952f2";
  const provider = ganache.provider({ wallet: { seed: "delta" } });

  const opt: ContractOption = {
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
  let stream: Readable;

  before(async function () {
    await datahub.init(opt);
    stream = datahub.subscribe(nodeAddress);
  });

  const dataset = "mnist";
  const commitment0 = "0x1230000000000000000000000000000000000000000000000000000000000000";

  it("register block 0", async () => {
    await datahub.register(nodeAddress, dataset, 0, commitment0);

    const _commitment = await datahub.getDataCommitment(nodeAddress, dataset, 0);
    assert.strictEqual(_commitment, commitment0);

    const event: DataRegisteredEvent | null = stream.read();
    assert.strictEqual(event?.name, dataset);
    assert.strictEqual(event?.index, 0);
    assert.strictEqual(event?.commitment, commitment0);
  });

  const commitment1 = "0x1110000000000000000000000000000000000000000000000000000000000000";
  it("register block 1", async () => {
    await datahub.register(nodeAddress, dataset, 1, commitment1);
    const _commitment = await datahub.getDataCommitment(nodeAddress, dataset, 1);
    assert.strictEqual(_commitment, commitment1);
    const event: DataRegisteredEvent | null = stream.read();
    assert.strictEqual(event?.name, dataset);
    assert.strictEqual(event?.index, 1);
    assert.strictEqual(event?.commitment, commitment1);
  });

  const newCommitment1 = "0x2220000000000000000000000000000000000000000000000000000000000000";
  it("update block 1", async () => {
    await datahub.register(nodeAddress, dataset, 1, newCommitment1);
    const _commitment = await datahub.getDataCommitment(nodeAddress, dataset, 1);
    assert.strictEqual(_commitment, newCommitment1);
    const event: DataRegisteredEvent | null = stream.read();
    assert.strictEqual(event?.name, dataset);
    assert.strictEqual(event?.index, 1);
    assert.strictEqual(event?.commitment, newCommitment1);
  });

});
