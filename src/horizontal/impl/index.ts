import { config } from "~/config";
import { Impl } from "./impl";
import * as coordinator from "./coordinator";
import * as ethereum from "./ethereum";

let impl: Impl;

if (config.impl === "coordinator") {
  impl = coordinator.impl;
} else {
  impl = ethereum.impl;
}

export { impl };
