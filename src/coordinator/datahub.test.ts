import { Options } from "@mikro-orm/core";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { Readable } from "stream";
import * as db from "~/db";
import { DataRegisteredEvent } from "~/event";
import { datahub } from "./datahub";
import { identity } from "./identity";

chai.use(chaiAsPromised);

const assert = chai.assert;

describe("datahub coordinator", () => {
  let address: string;
  let stream: Readable;

  before(async () => {
    const dbConfig: Options = {
      type: "sqlite",
      dbName: ":memory:",
      entities: ["dist/entity/**/*.js"],
      entitiesTs: ["src/entity/**/*.ts"],
    };
    await datahub.init(dbConfig);

    address = (await identity.join("127.0.0.1:6700", "node1"))[1];

    stream = datahub.subscribe(address);
  });

  after(async function () {
    await identity.leave(address);

    const orm = db.getORM();
    const generator = orm.getSchemaGenerator();
    await generator.dropSchema();
    await db.close();
  });

  const dataset = "mnist";
  const commitment0 = "0x1230000000000000000000000000000000000000000000000000000000000000";

  it("register block 0", async () => {
    await datahub.register(address, dataset, 0, commitment0);

    const _commitment = await datahub.getDataCommitment(address, dataset, 0);
    assert.strictEqual(_commitment, commitment0);

    const event: DataRegisteredEvent | null = stream.read();
    assert.strictEqual(event?.name, dataset);
    assert.strictEqual(event?.index, 0);
    assert.strictEqual(event?.commitment, commitment0);
  });

  const commitment1 = "0x1110000000000000000000000000000000000000000000000000000000000000";
  it("register block 1", async () => {
    await datahub.register(address, dataset, 1, commitment1);
    const _commitment = await datahub.getDataCommitment(address, dataset, 1);
    assert.strictEqual(_commitment, commitment1);
    const event: DataRegisteredEvent | null = stream.read();
    assert.strictEqual(event?.name, dataset);
    assert.strictEqual(event?.index, 1);
    assert.strictEqual(event?.commitment, commitment1);
  });

  const newCommitment1 = "0x2220000000000000000000000000000000000000000000000000000000000000";
  it("update block 1", async () => {
    await datahub.register(address, dataset, 1, newCommitment1);
    const _commitment = await datahub.getDataCommitment(address, dataset, 1);
    assert.strictEqual(_commitment, newCommitment1);
    const event: DataRegisteredEvent | null = stream.read();
    assert.strictEqual(event?.name, dataset);
    assert.strictEqual(event?.index, 1);
    assert.strictEqual(event?.commitment, newCommitment1);
  });
});
