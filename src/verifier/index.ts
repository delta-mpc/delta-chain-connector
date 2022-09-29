import BN from "bn.js";
import fs from "fs/promises";
import * as snarkjs from "snarkjs";

export async function getVk(weightSize: number): Promise<snarkjs.plonk.Verifier> {
  const vkPath = __dirname + `/key${weightSize}.json`;
  const vkStr = await fs.readFile(vkPath, { encoding: "utf-8" });
  const vk: snarkjs.plonk.Verifier = JSON.parse(vkStr);
  return vk;
}

export async function verify(
  vk: snarkjs.plonk.Verifier,
  proof: string,
  pubSignals: string[]
): Promise<boolean> {
  const proofStruct: snarkjs.plonk.Proof = JSON.parse(proof);
  return await snarkjs.plonk.verify(vk, pubSignals, proofStruct);
}

const curveQ = new Map<string, string>([
  ["bn128", "21888242871839275222246405745257275088548364400416034343698204186575808495617"],
]);

export function getQ(curve: string): BN {
  const q = curveQ.get(curve);
  if (!q) {
    throw new Error(`unknown curve ${curve}`);
  }
  return new BN(q, 10);
}

export async function exportCallData(proof: string, pubSignals: string[]): Promise<[string, string[]]> {
  const proofStruct: snarkjs.plonk.Proof = JSON.parse(proof);
  const calldata = await snarkjs.plonk.exportSolidityCallData(proofStruct, pubSignals);
  const sep = calldata.search(",");
  const _proof = calldata.slice(0, sep);
  const _pubSignals: string[] = JSON.parse(calldata.slice(sep + 1));
  return [_proof, _pubSignals];
}
