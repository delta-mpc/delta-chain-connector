declare module "snarkjs" {
  declare namespace plonk {
    interface Proof {
      A: string[];
      B: string[];
      C: string[];
      Z: string[];
      T1: string[];
      T2: string[];
      T3: string[];
      eval_a: string;
      eval_b: string;
      eval_c: string;
      eval_s1: string;
      eval_s2: string;
      eval_zw: string;
      eval_r: string;
      Wxi: string[];
      Wxiw: string[];
      protocol: "plonk";
      curve: string;
    }
    interface ProveResult {
      proof: Proof;
      publicSignals: string[];
    }
    interface Verifier {
      protocol: "plonk";
      curve: string;
      nPublic: number;
      power: number;
      k1: string;
      k2: string;
      Qm: string[];
      Ql: string[];
      Qr: string[];
      Qo: string[];
      Qc: string[];
      S1: string[];
      S2: string[];
      S3: string[];
      X_2: string[][];
      w: string;
    }

    async function setup(r1csName: string, ptauName: string, zkeyName: string): Promise<-1 | undefined>;
    async function fullProve(_input: string, wasmFile: string, zkeyFileName: string): Promise<ProveResult>;
    async function prove(zkeyFileName: string, witnessFileName: string): Promise<ProveResult>;
    async function verify(_vk_verifier: Verifier, _publicSignals: string[], _proof: Proof): Promise<boolean>;
    async function exportSolidityCallData(_proof: Proof, _pub: string[]): Promise<string>;
  }
}
