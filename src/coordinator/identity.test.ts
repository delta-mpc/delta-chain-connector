import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { identity } from "./identity";
import { Options } from "@mikro-orm/core";
import * as db from "~/db";
import * as entity from "~/entity/identity";

chai.use(chaiAsPromised);

const assert = chai.assert;

describe("coordinator service", function () {
  before(async function () {
    const dbConfig: Options = {
      type: "sqlite",
      dbName: "db/identity.test.db",
      entities: ["dist/entity/**/*.js"],
      entitiesTs: ["src/entity/**/*.ts"],
    };
    await identity.init(dbConfig);
  });

  after(async function () {
    const orm = db.getORM();
    const generator = orm.getSchemaGenerator();
    await generator.dropSchema();
    await orm.close(true);
  });

  let address1: string;
  let address2: string;
  let address3: string;
  let address4: string;

  describe("join", function () {
    it("join four nodes", async function () {
      address1 = (await identity.join("127.0.0.1:6700", "1"))[1];
      address2 = (await identity.join("127.0.0.1:6800", "2"))[1];
      address3 = (await identity.join("127.0.0.1:6900", "3"))[1];
      address4 = (await identity.join("127.0.0.1:7000", "4"))[1];

      assert.lengthOf(address1, 96);
      assert.lengthOf(address2, 96);
      assert.lengthOf(address3, 96);

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
  });

  describe("updateUrl", function () {
    it("update node4 url", async function () {
      await identity.updateUrl(address4, "127.0.0.1:7001");

      const em = db.getEntityManager();
      const node = await em.findOne(entity.Node, { address: address4 });

      assert.strictEqual(node?.url, "127.0.0.1:7001");
    });
  });

  describe("updateName", function () {
    it("update node4 name", async function () {
      await identity.updateName(address4, "44");

      const em = db.getEntityManager();
      const node = await em.findOne(entity.Node, { address: address4 });

      assert.strictEqual(node?.name, "44");
    });
  });

  describe("getNodeInfo", function () {
    it("get node1 info", async function () {
      const info = await identity.getNodeInfo(address1);

      assert.strictEqual(info.name, "1");
      assert.strictEqual(info.url, "127.0.0.1:6700");
    });
  });

  describe("getNodes", function () {
    it("get nodes", async function () {
      const nodes = await identity.getNodes(1, 20);
      assert.strictEqual(nodes.totalCount, 4);
      assert.strictEqual(nodes.nodes[0].address, address1);
      assert.strictEqual(nodes.nodes[1].address, address2);
      assert.strictEqual(nodes.nodes[2].address, address3);
      assert.strictEqual(nodes.nodes[3].address, address4);
    });
  });

  describe("leave", function () {
    it("leave node4", async function () {
      await identity.leave(address4);

      const em = db.getEntityManager();
      const node = await em.findOne(entity.Node, { address: address4, joined: true });

      assert.notExists(node);
    });
  });
});
