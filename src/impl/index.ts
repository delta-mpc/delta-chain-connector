import { config } from "src/config";
import { Impl } from "./service";
import * as monkey from "./monkey";

let impl: Impl;

if (config.impl === "monkey") {
  impl = monkey.impl;
} else {
  throw Error(`unknown implementation ${config.impl}`);
}

export { impl };
export * from "./event";
