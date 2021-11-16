import { config } from "src/config";
import { Service } from "./service";
import * as monkey from "./monkey";

let service: Service;

if (config.impl === "monkey") {
  service = monkey.service;
} else {
  throw Error(`unknown implementation ${config.impl}`);
}

export { service };
export * from "./event";
