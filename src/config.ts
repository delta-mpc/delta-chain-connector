import fs from "fs";

const configFile = process.env.COORDINATOR ?? __dirname + "/../config/config.json";

const file = fs.readFileSync(configFile, { encoding: "utf-8" });

type LogLevelType = "DEBUG" | "INFO" | "WARNING" | "ERROR" | "EXCEPTION";
type DatabaseType = "mysql" | "sqlite";

interface Config {
  log: {
    level: LogLevelType;
  };
  impl: string;
  host: string;
  port: number;
  nodeAddress: string;
  db: {
    type: DatabaseType;
    url: string;
  };
}

export const config = JSON.parse(file) as Config;
