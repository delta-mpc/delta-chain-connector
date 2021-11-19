import * as bunyan from "bunyan";
import { config } from "./config";

const log = bunyan.createLogger({
  name: "delta-chain-connector",
  level: config.log.level,
});

export default log;
