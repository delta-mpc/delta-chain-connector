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

  async register(address: string, name: string, index: number, commitment: string): Promise<string> {
    const em = db.getEntityManager();

    await identity.getNodeInfo(address);

    let record = await em.findOne(
      entity.DataRecord,
      { owner: address, name: name },
      { orderBy: { index: "DESC" } }
    );
    if (!record) {
      if (index !== 0) {
        throw new Error("First data block index should be 0");
      }
      record = new entity.DataRecord(address, name, index, commitment);
      em.persist(record);
    } else {
      if (index === record.index) {
        record.commitment = commitment;
      } else if (index === record.index + 1) {
        record = new entity.DataRecord(address, name, index, commitment);
        em.persist(record);
      } else {
        throw new Error("You can only update the last block or create a new block after it");
      }
    }

    await em.flush();
    this.subscriber.publish({
      type: "DataRegistered",
      owner: address,
      name: name,
      index: index,
      commitment: commitment,
    });
    return randomHex(32);
  }

  async getDataCommitment(address: string, name: string, index: number): Promise<string> {
    const em = db.getEntityManager();

    const record = await em.findOne(entity.DataRecord, { owner: address, name: name, index: index });
    if (!record) {
      throw new Error(`${address} doesn't have dataset ${name}`);
    }
    return record.commitment;
  }

  subscribe(address: string, timeout: number): Readable {
    return this.subscriber.subscribe(address, timeout);
  }

  unsubscribe(stream: Readable): void {
    return this.subscriber.unsubscribe(stream);
  }
}

export const datahub = new DataHub();
