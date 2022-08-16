import { config } from "~/config";
import { Impl } from "./service";
import * as coordinator from "./coordinator";
import * as ethereum from "./ethereum";

let impl: Impl;

if (config.impl === "coordinator") {
  impl = coordinator.impl;
} else {
  impl = ethereum.impl;
}

export { impl };
export * from "./event";
