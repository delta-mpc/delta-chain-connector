import { config } from "src/config";
import { Options } from "@mikro-orm/core";

let dbConfig: Options = {};

if (config.db.type == "sqlite") {
  dbConfig = {
    type: "sqlite",
    dbName: config.db.url,
    entities: ["dist/impl/monkey/entity/**.js"],
    entitiesTs: ["src/impl/monkey/entity/**.ts"],
  };
} else if (config.db.type == "mysql") {
  dbConfig = {
    type: "mysql",
    clientUrl: config.db.url,
    entities: ["dist/impl/monkey/entity/**.js"],
    entitiesTs: ["src/impl/monkey/entity/**.ts"],
  };
}

export default dbConfig;
