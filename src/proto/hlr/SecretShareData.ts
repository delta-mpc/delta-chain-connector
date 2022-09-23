// Original file: src/proto/hlr.proto

export interface SecretShareData {
  seed?: string;
  seedCommitment?: string;
  secretKey?: string;
  secretKeyCommitment?: string;
  _seed?: "seed";
  _seedCommitment?: "seedCommitment";
  _secretKey?: "secretKey";
  _secretKeyCommitment?: "secretKeyCommitment";
}

export interface SecretShareData__Output {
  seed?: string;
  seedCommitment?: string;
  secretKey?: string;
  secretKeyCommitment?: string;
  _seed: "seed";
  _seedCommitment: "seedCommitment";
  _secretKey: "secretKey";
  _secretKeyCommitment: "secretKeyCommitment";
}
