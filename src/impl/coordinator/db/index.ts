import { EntityManager, MikroORM } from "@mikro-orm/core";
import dbConfig from "./config";

interface DI {
  orm?: MikroORM;
  em?: EntityManager;
}

const DB: DI = {};

export async function init(cfg = dbConfig): Promise<void> {
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
