// Original file: src/service/chain.proto

import type {
  SecretShareData as _chain_SecretShareData,
  SecretShareData__Output as _chain_SecretShareData__Output,
} from "../chain/SecretShareData";

export interface SecretShareResp {
  shares?: _chain_SecretShareData[];
}

export interface SecretShareResp__Output {
  shares: _chain_SecretShareData__Output[];
}
