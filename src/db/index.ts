import { EntityManager, MikroORM } from "@mikro-orm/core";
import { Mutex } from "async-mutex";
import dbConfig from "./config";

interface DI {
  orm?: MikroORM;
  em?: EntityManager;
}

const DB: DI = {};

const initMutex = new Mutex();

export async function init(cfg = dbConfig): Promise<void> {
  await initMutex.runExclusive(async () => {
    if (!DB.orm) {
      const orm = await MikroORM.init(cfg);
      if (await orm.isConnected()) {
        DB.orm = orm;
        DB.em = orm.em;
      } else {
        throw new Error("db is not connected");
      }
      const generator = DB.orm.getSchemaGenerator();
      await generator.updateSchema();
    }
  });
}

export function getEntityManager(): EntityManager {
  if (DB.em) {
    return DB.em.fork();
  } else {
    throw new Error("db is not initialed");
  }
}

export function getORM(): MikroORM {
  if (DB.orm) {
    return DB.orm;
  } else {
    throw new Error("db is not initialed");
  }
}

export async function close(): Promise<void> {
  await initMutex.runExclusive(async () => {
    if (DB.orm) {
      await DB.orm.close(true);
      DB.orm = undefined;
      DB.em = undefined;
    } else {
      throw new Error("db is not initialed");
    }
  });
}
