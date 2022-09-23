import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import * as crypto from "crypto";
import * as db from "~/db";
import * as entity from "~/entity/horizontal";
import { horizontal } from "./horizontal";
import { Options } from "@mikro-orm/core";
import { identity } from "./identity";

chai.use(chaiAsPromised);

const assert = chai.assert;

function randomBytesString(length: number): string {
  return "0x" + crypto.randomBytes(length).toString("hex");
}

describe("coordinator horizontal", function () {
  let address1: string;
  let address2: string;
  let address3: string;
  let address4: string;

  before(async function () {
    const dbConfig: Options = {
      type: "sqlite",
      dbName: ":memory:",
      entities: ["dist/entity/**/*.js"],
      entitiesTs: ["src/entity/**/*.ts"],
    };
    await horizontal.init(dbConfig);

    address1 = (await identity.join("127.0.0.1:6700", "1"))[1];
    address2 = (await identity.join("127.0.0.1:6800", "2"))[1];
    address3 = (await identity.join("127.0.0.1:6900", "3"))[1];
    address4 = (await identity.join("127.0.0.1:7000", "4"))[1];
  });

  after(async function () {
    await identity.leave(address1);
    await identity.leave(address2);
    await identity.leave(address3);
    await identity.leave(address4);

    const orm = db.getORM();
    const generator = orm.getSchemaGenerator();
    await generator.dropSchema();
    await db.close();
  });

  let taskID: string;
  const dataset = "mnist";
  const taskCommitment = randomBytesString(32);
  const taskType = "horizontal";
  describe("createTask", function () {
    it("node1 create task1", async function () {
      taskID = (await horizontal.createTask(address1, dataset, taskCommitment, taskType))[1];

      assert.lengthOf(taskID, 66);
      assert.strictEqual(taskID.slice(0, 2), "0x");

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
      await horizontal.startRound(address1, taskID, round);

      const em = db.getEntityManager();
      const roundEntity = await em.findOne(entity.Round, { task: { outID: taskID }, round: round });

      assert.strictEqual(roundEntity?.status, entity.RoundStatus.Started);
    });
  });

  const pk11 = randomBytesString(32);
  const pk12 = randomBytesString(32);
  const pk21 = randomBytesString(32);
  const pk22 = randomBytesString(32);
  const pk31 = randomBytesString(32);
  const pk32 = randomBytesString(32);
  describe("joinRound", function () {
    it("node1,2,3 join round1", async function () {
      await horizontal.joinRound(address1, taskID, round, pk11, pk12);
      await horizontal.joinRound(address2, taskID, round, pk21, pk22);
      await horizontal.joinRound(address3, taskID, round, pk31, pk32);

      const em = db.getEntityManager();
      const roundEntity = await em.findOne(entity.Round, { task: { outID: taskID }, round: round });
      const member2 = await em.findOne(entity.RoundMember, { round: roundEntity, address: address2 });

      assert.strictEqual(member2?.address, address2);
      assert.strictEqual(member2?.status, entity.RoundStatus.Started);

      const pk21Entity = await em.findOne(entity.Key, { member: member2, type: entity.KeyType.PK1 });
      const pk22Entity = await em.findOne(entity.Key, { member: member2, type: entity.KeyType.PK2 });

      assert.strictEqual(pk21Entity?.key, pk21);
      assert.strictEqual(pk22Entity?.key, pk22);
    });
  });

  describe("getTaskRound", function () {
    it("get round1 of task1", async function () {
      const info = await horizontal.getTaskRound(taskID, round);

      assert.strictEqual(info.round, round);
      assert.strictEqual(info.status, entity.RoundStatus.Started);
      assert.lengthOf(info.clients, 3);
      assert.include(info.clients, address1);
      assert.include(info.clients, address2);
      assert.include(info.clients, address3);
    });
  });

  describe("selectCandidates", function () {
    it("select node2 and node3", async function () {
      await horizontal.selectCandidates(address1, taskID, round, [address2, address3]);

      const em = db.getEntityManager();
      const roundEntity = await em.findOne(entity.Round, { task: { outID: taskID }, round: round }, [
        "members",
      ]);
      assert.exists(roundEntity);

      for (const member of roundEntity!.members) {
        if (member.address === address1) {
          assert.strictEqual(member.status, entity.RoundStatus.Started);
        } else {
          assert.strictEqual(member.status, entity.RoundStatus.Running);
        }
      }
    });
  });

  const seedShareCommitment22 = randomBytesString(32);
  const seedShareCommitment23 = randomBytesString(32);
  const seedShareCommitment32 = randomBytesString(32);
  const seedShareCommitment33 = randomBytesString(32);

  const skShareCommitment22 = randomBytesString(32);
  const skShareCommitment23 = randomBytesString(32);
  const skShareCommitment32 = randomBytesString(32);
  const skShareCommitment33 = randomBytesString(33);
  describe("uploadSecretKeyCommitment", function () {
    it("node2,3 uploadSecretKeyCommitment", async function () {
      await horizontal.uploadSeedCommitment(
        address2,
        taskID,
        round,
        [address2, address3],
        [seedShareCommitment22, seedShareCommitment23]
      );
      await horizontal.uploadSeedCommitment(
        address3,
        taskID,
        round,
        [address2, address3],
        [seedShareCommitment32, seedShareCommitment33]
      );
      await horizontal.uploadSecretKeyCommitment(
        address2,
        taskID,
        round,
        [address2, address3],
        [skShareCommitment22, skShareCommitment23]
      );
      await horizontal.uploadSecretKeyCommitment(
        address3,
        taskID,
        round,
        [address2, address3],
        [skShareCommitment32, skShareCommitment33]
      );

      const ssDatas2 = await horizontal.getSecretShareDatas(taskID, round, [address2, address3], address2);
      const ssDatas3 = await horizontal.getSecretShareDatas(taskID, round, [address2, address3], address3);

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
      const pks = await horizontal.getClientPublicKeys(taskID, round, [address2, address3]);

      assert.strictEqual(pks[0][0], pk21);
      assert.strictEqual(pks[0][1], pk22);
      assert.strictEqual(pks[1][0], pk31);
      assert.strictEqual(pks[1][1], pk32);
    });
  });

  describe("startCalculation", function () {
    it("node2,3 start calculation", async function () {
      await horizontal.startCalculation(address1, taskID, round, [address2, address3]);

      const em = db.getEntityManager();
      const roundEntity = await em.findOne(entity.Round, { task: { outID: taskID }, round: round });
      assert.strictEqual(roundEntity?.status, entity.RoundStatus.Calculating);

      const members = await em.find(entity.RoundMember, {
        round: roundEntity,
        status: entity.RoundStatus.Calculating,
      });
      assert.lengthOf(members, 2);
      const memberAddrs = members.map((member) => member.address);
      assert.includeMembers(memberAddrs, [address2, address3]);
    });
  });

  const resultCommitment2 = randomBytesString(32);
  describe("uploadResultCommitment and getResultCommitment", function () {
    it("node2 upload result commitment", async function () {
      await horizontal.uploadResultCommitment(address2, taskID, round, resultCommitment2);

      const resultCommitment2_ = await horizontal.getResultCommitment(taskID, round, address2);
      assert.strictEqual(resultCommitment2, resultCommitment2_);
      assert.isRejected(horizontal.getResultCommitment(taskID, round, address3), Error);
    });
  });

  describe("startAggregation", function () {
    it("node2 startAggregation", async function () {
      await horizontal.startAggregation(address1, taskID, round, [address2]);

      const em = db.getEntityManager();
      const roundEntity = await em.findOne(entity.Round, { task: { outID: taskID }, round: round });
      assert.strictEqual(roundEntity?.status, entity.RoundStatus.Aggregating);

      const members = await em.find(entity.RoundMember, {
        round: roundEntity,
        status: entity.RoundStatus.Aggregating,
      });
      const memberAddrs = members.map((member) => member.address);
      assert.lengthOf(memberAddrs, 1);
      assert.include(memberAddrs, address2);
    });
  });

  const seedShare22 = randomBytesString(32);
  describe("uploadSeed and getSecretShareData", function () {
    it("node2 upload node2 seed", async function () {
      await horizontal.uploadSeed(address2, taskID, round, [address2], [seedShare22]);

      const ssDatas = await horizontal.getSecretShareDatas(taskID, round, [address2], address2);
      assert.notExists(ssDatas[0].secretKey);
      assert.exists(ssDatas[0].secretKeyCommitment);
      assert.strictEqual(ssDatas[0].seed, seedShare22);
      assert.strictEqual(ssDatas[0].seedCommitment, seedShareCommitment22);
    });
  });

  const skShare32 = randomBytesString(32);
  describe("uploadSecretKey and getSecretShareData", function () {
    it("node2 upload node3 sk", async function () {
      await horizontal.uploadSecretKey(address2, taskID, round, [address3], [skShare32]);

      const ssDatas = await horizontal.getSecretShareDatas(taskID, round, [address3], address2);
      assert.notExists(ssDatas[0].seed);
      assert.exists(ssDatas[0].seedCommitment);
      assert.strictEqual(ssDatas[0].secretKey, skShare32);
      assert.strictEqual(ssDatas[0].secretKeyCommitment, skShareCommitment32);
    });
  });

  describe("endRound", function () {
    it("endRound", async function () {
      await horizontal.endRound(address1, taskID, round);

      const em = db.getEntityManager();
      const roundEntity = await em.findOne(entity.Round, {
        task: { outID: taskID },
        round: round,
      });
      assert.strictEqual(roundEntity?.status, entity.RoundStatus.Finished);

      // const members = await em.find(entity.RoundMember, {
      //   round: roundEntity,
      //   status: RoundStatus.Finished,
      // });
      // assert.lengthOf(members, 1);
      // assert.strictEqual(members[0].address, address2);
    });
  });

  describe("finishTask", function () {
    it("finishTask", async function () {
      await horizontal.finishTask(address1, taskID);

      const taskInfo = await horizontal.getTask(taskID);
      assert.isTrue(taskInfo.finished);
    });
  });
});
