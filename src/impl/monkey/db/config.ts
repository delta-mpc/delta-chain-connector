import { config } from "~/config";
import { Options } from "@mikro-orm/core";

let dbConfig: Options = {};

if (config.monkey.db.type == "sqlite") {
  dbConfig = {
    type: "sqlite",
    dbName: config.monkey.db.url,
    entities: ["../entity"],
    entitiesTs: ["../entity"],
    baseDir: __dirname,
  };
} else if (config.monkey.db.type == "mysql") {
  dbConfig = {
    type: "mysql",
    clientUrl: config.monkey.db.url,
    entities: ["../entity"],
    entitiesTs: ["../entity"],
    baseDir: __dirname,
  };
}

export default dbConfig;
