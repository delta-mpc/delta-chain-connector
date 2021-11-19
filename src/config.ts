import fs from "fs";

const configFile = process.env.COORDINATOR ?? __dirname + "/../config/config.json";

const file = fs.readFileSync(configFile, { encoding: "utf-8" });

type LogLevelType = "debug" | "info" | "warn" | "error" | "fatal";
type DatabaseType = "mysql" | "sqlite";

interface Config {
  log: {
    level: LogLevelType;
  };
  impl: "monkey" | "chain";
  host: string;
  port: number;
  monkey: {
    db: {
      type: DatabaseType;
      url: string;
    };
  },
  chain: {
    contractAddress: string,
    nodeAddress: string,
    privateKey: string,
    provider: string,
    abiFile: string,
    gasPrice: number,
    gasLimit: number,
    chainParam: {
      name: string,
      chainId: number,
    }
  }
}

export const config = JSON.parse(file) as Config;