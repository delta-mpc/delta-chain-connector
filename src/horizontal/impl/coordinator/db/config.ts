import { config } from "~/config";
import { Options } from "@mikro-orm/core";

let dbConfig: Options = {};

if (config.coordinator.db.type == "sqlite") {
  dbConfig = {
    type: "sqlite",
    dbName: config.coordinator.db.url,
    entities: ["../entity"],
    entitiesTs: ["../entity"],
    baseDir: __dirname,
  };
} else if (config.coordinator.db.type == "mysql") {
  dbConfig = {
    type: "mysql",
    clientUrl: config.coordinator.db.url,
    entities: ["../entity"],
    entitiesTs: ["../entity"],
    baseDir: __dirname,
  };
}

export default dbConfig;
