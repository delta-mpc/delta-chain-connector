import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { identity } from "./identity";
import { Options } from "@mikro-orm/core";
import * as db from "~/db";
import * as entity from "~/entity/identity";
import * as sinon from "sinon";

chai.use(chaiAsPromised);

const assert = chai.assert;

describe("coordinator identity", function () {
  let clock: sinon.SinonFakeTimers;
  before(async () => {
    const dbConfig: Options = {
      type: "sqlite",
      dbName: ":memory:",
      entities: ["dist/entity/**/*.js"],
      entitiesTs: ["src/entity/**/*.ts"],
    };
    await identity.init(dbConfig);
    clock = sinon.useFakeTimers(new Date());
  });

  after(async () => {
    const orm = db.getORM();
    const generator = orm.getSchemaGenerator();
    await generator.dropSchema();
    await db.close();
    clock.restore();
  });

  let address1: string;
  let address2: string;
  let address3: string;
  let address4: string;

  it("join four nodes", async () => {
    address1 = (await identity.join("127.0.0.1:6700", "1"))[1];
    address2 = (await identity.join("127.0.0.1:6800", "2"))[1];
    address3 = (await identity.join("127.0.0.1:6900", "3"))[1];
    address4 = (await identity.join("127.0.0.1:7000", "4"))[1];

    assert.lengthOf(address1, 42);
    assert.lengthOf(address2, 42);
    assert.lengthOf(address3, 42);

    const em = db.getEntityManager();
    const node1 = await em.findOne(entity.Node, { address: address1 });
    assert.strictEqual(node1?.name, "1");
    assert.strictEqual(node1?.url, "127.0.0.1:6700");

    const node2 = await em.findOne(entity.Node, { address: address2 });
    assert.strictEqual(node2?.name, "2");
    assert.strictEqual(node2?.url, "127.0.0.1:6800");

    const node3 = await em.findOne(entity.Node, { address: address3 });
    assert.strictEqual(node3?.name, "3");
    assert.strictEqual(node3?.url, "127.0.0.1:6900");

    const node4 = await em.findOne(entity.Node, { address: address4 });
    assert.strictEqual(node4?.name, "4");
    assert.strictEqual(node4?.url, "127.0.0.1:7000");
  });

  it("leave node4", async () => {
    await identity.leave(address4);

    const em = db.getEntityManager();
    const node = await em.findOne(entity.Node, { address: address4 });

    assert.isNotTrue(node?.isAlive());
  });

  it("get node1 info", async () => {
    const info = await identity.getNodeInfo(address1);

    assert.strictEqual(info.name, "1");
    assert.strictEqual(info.url, "127.0.0.1:6700");
  });

  it("update url", async () => {
    const url = "127.0.0.1:6701";
    await identity.updateUrl(address1, url);

    const info = await identity.getNodeInfo(address1);
    assert.strictEqual(info.url, url);

    assert.isRejected(identity.updateUrl(address4, url));
  });

  it("update name", async () => {
    const name = "11";
    await identity.updateName(address1, name);

    const info = await identity.getNodeInfo(address1);
    assert.strictEqual(info.name, name);

    assert.isRejected(identity.updateName(address4, name));
  });

  it("get nodes", async () => {
    const nodes = await identity.getNodes(1, 20);
    assert.strictEqual(nodes.totalCount, 3);
    assert.strictEqual(nodes.nodes[0].address, address1);
    assert.strictEqual(nodes.nodes[1].address, address2);
    assert.strictEqual(nodes.nodes[2].address, address3);
  });

  it("auto leave", async () => {
    await clock.tickAsync(2 * 60 * 1000);

    const em = db.getEntityManager();
    for (const address of [address1, address2, address3]) {
      const node = await em.findOne(entity.Node, { address: address });

      assert.isNotNull(node);
      assert.isFalse(node?.isAlive());
    }
  });
});
