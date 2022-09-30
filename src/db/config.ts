import { config } from "~/config";
import { Options } from "@mikro-orm/core";

let dbConfig: Options = {};

if (config.coordinator.db.type == "sqlite") {
  dbConfig = {
    type: "sqlite",
    dbName: config.coordinator.db.url,
    entities: ["../entity/**/*.js"],
    entitiesTs: ["../entity/**/*.ts"],
    baseDir: __dirname
  };
} else if (config.coordinator.db.type == "mysql") {
  const rawUrl = config.coordinator.db.url;
  const urlSplits = rawUrl.split("/");
  const dbName = urlSplits[urlSplits.length - 1];
  const clientUrl = rawUrl.slice(0, -dbName.length + 1);
  dbConfig = {
    type: "mysql",
    dbName: dbName,
    clientUrl: clientUrl,
    entities: ["../entity/**/*.js"],
    entitiesTs: ["../entity/**/*.ts"],
    baseDir: __dirname
  };
}

export default dbConfig;
