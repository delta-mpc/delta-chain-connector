import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import path from "path";
import { ContractOption } from "./contract";
import { identity } from "./identity";
import ganache from "ganache";

chai.use(chaiAsPromised);

const assert = chai.assert;

describe("ethereum identity", function () {
  this.timeout(0);
  const nodeAddress = "0x6578aDabE867C4F7b2Ce4c59aBEAbDC754fBb990";
  const privateKey = "f0f239a0cc63b338e4633cec4aaa3b705a4531d45ef0cbcc7ba0a4b993a952f2";

  const opt: ContractOption = {
    nodeAddress: nodeAddress,
    privateKey: privateKey,
    provider: ganache.provider({ wallet: { seed: "delta" } }),
    gasPrice: 20000000000,
    gasLimit: 6721975,
    chainParam: {
      chainId: 1337,
    },
    abiFile: path.resolve(__dirname + "/../contract/IdentityContract.json"),
  };

  before(async function () {
    await identity.init(opt);
  });

  const serverUrl = "127.0.0.1:6700";
  const serverName = "first";
  it("join and get", async function () {
    const [, address] = await identity.join(serverUrl, serverName);
    assert.strictEqual(address, nodeAddress);

    const info = await identity.getNodeInfo(address);
    assert.strictEqual(info.url, serverUrl);
    assert.strictEqual(info.name, serverName);
  });

  it("get nodes", async function () {
    const nodes = await identity.getNodes(1, 20);
    assert.strictEqual(nodes.totalCount, 1);
    assert.strictEqual(nodes.nodes[0].address, nodeAddress);
    assert.strictEqual(nodes.nodes[0].url, serverUrl);
    assert.strictEqual(nodes.nodes[0].name, serverName);
  });

  const newServerUrl = "127.0.0.1:6701";
  const newServerName = "new";
  it("node update", async function () {
    await identity.updateUrl(nodeAddress, newServerUrl);
    await identity.updateName(nodeAddress, newServerName);

    const info = await identity.getNodeInfo(nodeAddress);
    assert.strictEqual(info.url, newServerUrl);
    assert.strictEqual(info.name, newServerName);
  });

  it("node leave", async function () {
    await identity.leave(nodeAddress);

    assert.isRejected(identity.getNodeInfo(nodeAddress));
  });
});
