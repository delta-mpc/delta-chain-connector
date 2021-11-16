// Original file: src/service/chain.proto

export interface SecretShareResp {
  seed?: string;
  seedCommitment?: string;
  secretKey?: string;
  secretKeyCommitment?: string;
  _seed?: "seed";
  _seedCommitment?: "seedCommitment";
  _secretKey?: "secretKey";
  _secretKeyCommitment?: "secretKeyCommitment";
}

export interface SecretShareResp__Output {
  seed?: string;
  seedCommitment?: string;
  secretKey?: string;
  secretKeyCommitment?: string;
  _seed: "seed";
  _seedCommitment: "seedCommitment";
  _secretKey: "secretKey";
  _secretKeyCommitment: "secretKeyCommitment";
}
