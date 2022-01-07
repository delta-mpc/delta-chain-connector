import fs from "fs";
import path from "path";

const configFile = process.env.COORDINATOR ?? process.env.PWD + "/config/config.json";

type LogLevelType = "debug" | "info" | "warn" | "error" | "fatal";
type DatabaseType = "mysql" | "sqlite";

interface ContractOption {
  contractAddress: string;
}

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
  };
  chain: {
    nodeAddress: string;
    privateKey: string;
    provider: string;
    gasPrice: number;
    gasLimit: number;
    chainParam: {
      name?: string;
      chainId?: number;
    };

    identity: ContractOption;
    hfl: ContractOption;
  };
}

const defaultConfig: Config = {
  log: {
    level: "info",
  },
  impl: "monkey",
  host: "0.0.0.0",
  port: 4500,
  monkey: {
    db: {
      type: "sqlite",
      url: "db/chain.db",
    },
  },
  chain: {
    nodeAddress: "",
    privateKey: "",
    provider: "http://127.0.0.1:8545",
    gasPrice: 1,
    gasLimit: 6721975,
    chainParam: {
      chainId: 1337,
    },

    identity: {
      contractAddress: "",
    },
    hfl: {
      contractAddress: "",
    },
  },
};

export function init(): void {
  console.log(configFile);
  if (!fs.existsSync(configFile)) {
    const configDir = path.dirname(configFile);
    fs.mkdirSync(configDir, { recursive: true });
    fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 4), { encoding: "utf-8" });
  }
}

function getConfig(): Config {
  let config: Config;
  if (fs.existsSync(configFile)) {
    const configStr = fs.readFileSync(configFile, { encoding: "utf-8" });
    config = JSON.parse(configStr) as Config;
  } else {
    config = defaultConfig;
  }
  return config;
}

export const config: Config = getConfig();
