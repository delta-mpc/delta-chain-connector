import { Options } from "@mikro-orm/core";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import * as db from "~/db";
import { datahub } from "./datahub";
import { identity } from "./identity";

chai.use(chaiAsPromised);

const assert = chai.assert;

describe("datahub coordinator", () => {
  let address: string;

  before(async () => {
    const dbConfig: Options = {
      type: "sqlite",
      dbName: ":memory:",
      entities: ["dist/entity/**/*.js"],
      entitiesTs: ["src/entity/**/*.ts"],
    };
    await datahub.init(dbConfig);

    address = (await identity.join("127.0.0.1:6700", "node1"))[1];
  });

  after(async function () {
    await identity.leave(address);

    const orm = db.getORM();
    const generator = orm.getSchemaGenerator();
    await generator.dropSchema();
    await orm.close(true);
  });

  const dataset = "mnist";
  const commitment = "0x1230000000000000000000000000000000000000000000000000000000000000";

  it("register", async () => {
    await datahub.register(address, dataset, commitment);

    const _commitment = await datahub.getDataCommitment(address, dataset);
    assert.strictEqual(_commitment, commitment);

    const version = await datahub.getDataVersion(address, dataset);
    assert.strictEqual(version, 1);
  });

  const newCommitment = "0x1230000000000000000000000000000000000000000000000000000000000001";
  it("update", async () => {
    await datahub.register(address, dataset, newCommitment);

    const _commitment = await datahub.getDataCommitment(address, dataset);
    assert.strictEqual(_commitment, newCommitment);

    const version = await datahub.getDataVersion(address, dataset);
    assert.strictEqual(version, 2);
  });
});
