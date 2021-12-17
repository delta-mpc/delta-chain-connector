import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import * as crypto from "crypto";
import { impl, ImplOption } from ".";
import { KeyType, RoundStatus } from "../service";
import * as db from "./db";
import * as entity from "./entity";

chai.use(chaiAsPromised);

const assert = chai.assert;

describe("monkey service", function () {
  before(async function () {
    const dbConfig: ImplOption = {
      type: "sqlite",
      dbName: "db/chain.test.db",
      entities: ["dist/impl/monkey/entity/**.js"],
      entitiesTs: ["src/impl/monkey/entity/**.ts"],
    };
    await impl.init(dbConfig);

    const generator = db.getORM().getSchemaGenerator();
    await generator.createSchema();
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
      address1 = await impl.join("127.0.0.1:6700", "1");
      address2 = await impl.join("127.0.0.1:6800", "2");
      address3 = await impl.join("127.0.0.1:6900", "3");
      address4 = await impl.join("127.0.0.1:7000", "4");

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
      await impl.updateUrl(address4, "127.0.0.1:7001");

      const em = db.getEntityManager();
      const node = await em.findOne(entity.Node, { address: address4 });

      assert.strictEqual(node?.url, "127.0.0.1:7001");
    });
  });

  describe("updateName", function () {
    it("update node4 name", async function () {
      await impl.updateName(address4, "44");

      const em = db.getEntityManager();
      const node = await em.findOne(entity.Node, { address: address4 });

      assert.strictEqual(node?.name, "44");
    });
  });

  describe("leave", function () {
    it("leave node4", async function () {
      await impl.leave(address4);

      const em = db.getEntityManager();
      const node = await em.findOne(entity.Node, { address: address4 });

      assert.notExists(node);
    });
  });

  describe("getNodeInfo", function () {
    it("get node1 info", async function () {
      const info = await impl.getNodeInfo(address1);

      assert.strictEqual(info.name, "1");
      assert.strictEqual(info.url, "127.0.0.1:6700");
    });
  });

  let taskID: string;
  const dataset = "mnist";
  const taskCommitment = crypto.randomBytes(32).toString("hex");
  const taskType = "horizontal";
  describe("createTask", function () {
    it("node1 create task1", async function () {
      taskID = await impl.createTask(address1, dataset, taskCommitment, taskType);

      assert.lengthOf(taskID, 64);

      const em = db.getEntityManager();
      const task = await em.findOne(entity.Task, { outID: taskID });

      assert.strictEqual(task?.outID, taskID);
      assert.strictEqual(task?.dataset, dataset);
      assert.strictEqual(task?.commitment, taskCommitment);
    });
  });

  const round = 1;
  describe("startRound", function () {
    it("node1 start round1 of task1", async function () {
      await impl.startRound(address1, taskID, round);

      const em = db.getEntityManager();
      const roundEntity = await em.findOne(entity.Round, { task: { outID: taskID }, round: round });

      assert.strictEqual(roundEntity?.status, RoundStatus.Started);
    });
  });

  const pk11 = crypto.randomBytes(32).toString("hex");
  const pk12 = crypto.randomBytes(32).toString("hex");
  const pk21 = crypto.randomBytes(32).toString("hex");
  const pk22 = crypto.randomBytes(32).toString("hex");
  const pk31 = crypto.randomBytes(32).toString("hex");
  const pk32 = crypto.randomBytes(32).toString("hex");
  describe("joinRound", function () {
    it("node1,2,3 join round1", async function () {
      await impl.joinRound(address1, taskID, round, pk11, pk12);
      await impl.joinRound(address2, taskID, round, pk21, pk22);
      await impl.joinRound(address3, taskID, round, pk31, pk32);

      const em = db.getEntityManager();
      const roundEntity = await em.findOne(entity.Round, { task: { outID: taskID }, round: round });
      const member2 = await em.findOne(entity.RoundMember, { round: roundEntity, address: address2 });

      assert.strictEqual(member2?.address, address2);
      assert.strictEqual(member2?.status, RoundStatus.Started);

      const pk21Entity = await em.findOne(entity.Key, { member: member2, type: KeyType.PK1 });
      const pk22Entity = await em.findOne(entity.Key, { member: member2, type: KeyType.PK2 });

      assert.strictEqual(pk21Entity?.key, pk21);
      assert.strictEqual(pk22Entity?.key, pk22);
    });
  });

  describe("getTaskRound", function () {
    it("get round1 of task1", async function () {
      const info = await impl.getTaskRound(taskID, round);

      assert.strictEqual(info.round, round);
      assert.strictEqual(info.status, RoundStatus.Started);
      assert.lengthOf(info.clients, 3);
      assert.include(info.clients, address1);
      assert.include(info.clients, address2);
      assert.include(info.clients, address3);
    });
  });

  describe("selectCandidates", function () {
    it("select node2 and node3", async function () {
      await impl.selectCandidates(address1, taskID, round, [address2, address3]);

      const em = db.getEntityManager();
      const roundEntity = await em.findOne(entity.Round, { task: { outID: taskID }, round: round }, [
        "members",
      ]);
      assert.exists(roundEntity);

      for (const member of roundEntity!.members) {
        if (member.address === address1) {
          assert.strictEqual(member.status, RoundStatus.Started);
        } else {
          assert.strictEqual(member.status, RoundStatus.Running);
        }
      }
    });
  });

  const seedShareCommitment22 = crypto.randomBytes(32).toString("hex");
  const seedShareCommitment23 = crypto.randomBytes(32).toString("hex");
  const seedShareCommitment32 = crypto.randomBytes(32).toString("hex");
  const seedShareCommitment33 = crypto.randomBytes(32).toString("hex");

  const skShareCommitment22 = crypto.randomBytes(32).toString("hex");
  const skShareCommitment23 = crypto.randomBytes(32).toString("hex");
  const skShareCommitment32 = crypto.randomBytes(32).toString("hex");
  const skShareCommitment33 = crypto.randomBytes(33).toString("hex");
  describe("uploadSecretKeyCommitment", function () {
    it("node2,3 uploadSecretKeyCommitment", async function () {
      await impl.uploadSeedCommitment(
        address2,
        taskID,
        round,
        [address2, address3],
        [seedShareCommitment22, seedShareCommitment23]
      );
      await impl.uploadSeedCommitment(
        address3,
        taskID,
        round,
        [address2, address3],
        [seedShareCommitment32, seedShareCommitment33]
      );
      await impl.uploadSecretKeyCommitment(
        address2,
        taskID,
        round,
        [address2, address3],
        [skShareCommitment22, skShareCommitment23]
      );
      await impl.uploadSecretKeyCommitment(
        address3,
        taskID,
        round,
        [address2, address3],
        [skShareCommitment32, skShareCommitment33]
      );

      const ssDatas2 = await impl.getSecretShareDatas(taskID, round, [address2, address3], address2);
      const ssDatas3 = await impl.getSecretShareDatas(taskID, round, [address2, address3], address3);

      assert.strictEqual(ssDatas2[0].seedCommitment, seedShareCommitment22);
      assert.strictEqual(ssDatas3[0].seedCommitment, seedShareCommitment23);
      assert.strictEqual(ssDatas2[1].seedCommitment, seedShareCommitment32);
      assert.strictEqual(ssDatas3[1].seedCommitment, seedShareCommitment33);

      assert.strictEqual(ssDatas2[0].secretKeyCommitment, skShareCommitment22);
      assert.strictEqual(ssDatas3[0].secretKeyCommitment, skShareCommitment23);
      assert.strictEqual(ssDatas2[1].secretKeyCommitment, skShareCommitment32);
      assert.strictEqual(ssDatas3[1].secretKeyCommitment, skShareCommitment33);
    });
  });

  describe("getClientPublickKeys", function () {
    it("get node2,3 public keys", async function () {
      const pks = await impl.getClientPublickKeys(taskID, round, [address2, address3]);

      assert.strictEqual(pks[0][0], pk21);
      assert.strictEqual(pks[0][1], pk22);
      assert.strictEqual(pks[1][0], pk31);
      assert.strictEqual(pks[1][1], pk32);
    });
  });

  describe("startCalculation", function () {
    it("node2,3 start calculation", async function () {
      await impl.startCalculation(address1, taskID, round, [address2, address3]);

      const em = db.getEntityManager();
      const roundEntity = await em.findOne(entity.Round, { task: { outID: taskID }, round: round });
      assert.strictEqual(roundEntity?.status, RoundStatus.Calculating);

      const members = await em.find(entity.RoundMember, {
        round: roundEntity,
        status: RoundStatus.Calculating,
      });
      assert.lengthOf(members, 2);
      const memberAddrs = members.map((member) => member.address);
      assert.includeMembers(memberAddrs, [address2, address3]);
    });
  });

  const resultCommitment2 = crypto.randomBytes(32).toString("hex");
  describe("uploadResultCommitment and getResultCommitment", function () {
    it("node2 upload result commitment", async function () {
      await impl.uploadResultCommitment(address2, taskID, round, resultCommitment2);

      const resultCommitment2_ = await impl.getResultCommitment(taskID, round, address2);
      assert.strictEqual(resultCommitment2, resultCommitment2_);
      assert.isRejected(impl.getResultCommitment(taskID, round, address3), Error);
    });
  });

  describe("startAggregation", function () {
    it("node2 startAggregation", async function () {
      await impl.startAggregation(address1, taskID, round, [address2]);

      const em = db.getEntityManager();
      const roundEntity = await em.findOne(entity.Round, { task: { outID: taskID }, round: round });
      assert.strictEqual(roundEntity?.status, RoundStatus.Aggregating);

      const members = await em.find(entity.RoundMember, {
        round: roundEntity,
        status: RoundStatus.Aggregating,
      });
      const memberAddrs = members.map((member) => member.address);
      assert.lengthOf(memberAddrs, 1);
      assert.include(memberAddrs, address2);
    });
  });

  const seedShare22 = crypto.randomBytes(32).toString("hex");
  describe("uploadSeed and getSecretShareData", function () {
    it("node2 upload node2 seed", async function () {
      await impl.uploadSeed(address2, taskID, round, [address2], [seedShare22]);

      const ssDatas = await impl.getSecretShareDatas(taskID, round, [address2], address2);
      assert.notExists(ssDatas[0].secretKey);
      assert.exists(ssDatas[0].secretKeyCommitment);
      assert.strictEqual(ssDatas[0].seed, seedShare22);
      assert.strictEqual(ssDatas[0].seedCommitment, seedShareCommitment22);
    });
  });

  const skShare32 = crypto.randomBytes(32).toString("hex");
  describe("uploadSecretKey and getSecretShareData", function () {
    it("node2 upload node3 sk", async function () {
      await impl.uploadSecretKey(address2, taskID, round, [address3], [skShare32]);

      const ssDatas = await impl.getSecretShareDatas(taskID, round, [address3], address2);
      assert.notExists(ssDatas[0].seed);
      assert.exists(ssDatas[0].seedCommitment);
      assert.strictEqual(ssDatas[0].secretKey, skShare32);
      assert.strictEqual(ssDatas[0].secretKeyCommitment, skShareCommitment32);
    });
  });

  describe("endRound", function () {
    it("endRound", async function () {
      await impl.endRound(address1, taskID, round);

      const em = db.getEntityManager();
      const roundEntity = await em.findOne(entity.Round, {
        task: { outID: taskID },
        round: round,
      });
      assert.strictEqual(roundEntity?.status, RoundStatus.Finished);

      const members = await em.find(entity.RoundMember, {
        round: roundEntity,
        status: RoundStatus.Finished,
      });
      assert.lengthOf(members, 1);
      assert.strictEqual(members[0].address, address2);
    });
  });
});
