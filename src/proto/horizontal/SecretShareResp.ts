// Original file: src/proto/horizontal.proto

import type {
  SecretShareData as _horizontal_SecretShareData,
  SecretShareData__Output as _horizontal_SecretShareData__Output,
} from "../horizontal/SecretShareData";

export interface SecretShareResp {
  shares?: _horizontal_SecretShareData[];
}

export interface SecretShareResp__Output {
  shares: _horizontal_SecretShareData__Output[];
}
