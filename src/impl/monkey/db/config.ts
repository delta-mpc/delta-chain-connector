import { config } from "config";
import { Options } from "@mikro-orm/core";

let dbConfig: Options = {};

if (config.monkey.db.type == "sqlite") {
  dbConfig = {
    type: "sqlite",
    dbName: config.monkey.db.url,
    entities: ["dist/impl/monkey/entity/**.js"],
    entitiesTs: ["src/impl/monkey/entity/**.ts"],
  };
} else if (config.monkey.db.type == "mysql") {
  dbConfig = {
    type: "mysql",
    clientUrl: config.monkey.db.url,
    entities: ["dist/impl/monkey/entity/**.js"],
    entitiesTs: ["src/impl/monkey/entity/**.ts"],
  };
}

export default dbConfig;
