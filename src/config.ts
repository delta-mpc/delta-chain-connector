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
    provider: "wss://apus.chain.deltampc.com",
    gasPrice: 1,
    gasLimit: 4294967294,
    chainParam: {
      chainId: 42,
    },

    identity: {
      contractAddress: "0x43A6feb218F0a1Bc3Ad9d9045ee6528349572E42",
    },
    hfl: {
      contractAddress: "0x3830C82700B050dA87F1D1A60104Fb667227B686",
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
