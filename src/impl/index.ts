import { config } from "~/config";
import { Impl } from "./service";
import * as monkey from "./coordinator";
import * as chain from "./ethereum";

let impl: Impl;

if (config.impl === "monkey") {
  impl = monkey.impl;
} else {
  impl = chain.impl;
}

export { impl };
export * from "./event";
