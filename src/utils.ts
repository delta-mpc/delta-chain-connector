import * as crypto from "crypto";

export function randomHex(length: number): string {
  return "0x" + crypto.randomBytes(length).toString("hex");
}
