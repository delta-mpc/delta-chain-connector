import { Readable } from "stream";
import * as db from "~/db";
import dbConfig from "~/db/config";
import * as entity from "~/entity/datahub";
import { DataRegisteredEvent, Subscriber } from "~/event";
import { DataHubImpl } from "~/impl/datahub";
import { randomHex } from "~/utils";
import { identity } from "./identity";

class DataHub implements DataHubImpl {
  private subscriber = new Subscriber<DataRegisteredEvent>();

  async init(cfg = dbConfig): Promise<void> {
    await db.init(cfg);
  }

  async register(address: string, name: string, commitment: string): Promise<string> {
    const em = db.getEntityManager();

    await identity.getNodeInfo(address);

    let record = await em.findOne(entity.DataRecord, { owner: address, name: name });
    if (record) {
      record.commitment = commitment;
      record.version += 1;
    } else {
      record = new entity.DataRecord(address, name, commitment);
      em.persist(record);
    }

    await em.flush();
    this.subscriber.publish({
      type: "DataRegistered",
      owner: address,
      name: name,
      commitment: commitment,
      version: record.version,
    });
    return randomHex(32);
  }

  async getDataCommitment(address: string, name: string): Promise<string> {
    const em = db.getEntityManager();

    const record = await em.findOne(entity.DataRecord, { owner: address, name: name });
    if (!record) {
      throw new Error(`${address} doesn't have dataset ${name}`);
    }
    return record.commitment;
  }

  async getDataVersion(address: string, name: string): Promise<number> {
    const em = db.getEntityManager();

    const record = await em.findOne(entity.DataRecord, { owner: address, name: name });
    if (!record) {
      throw new Error(`${address} doesn't have dataset ${name}`);
    }
    return record.version;
  }

  subscribe(address: string, timeout: number): Readable {
    return this.subscriber.subscribe(address, timeout);
  }

  unsubscribe(stream: Readable): void {
    return this.subscriber.unsubscribe(stream);
  }
}

export const datahub = new DataHub();
