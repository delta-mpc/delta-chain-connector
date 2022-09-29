// Original file: src/proto/hlr.proto

import type {
  SecretShareData as _hlr_SecretShareData,
  SecretShareData__Output as _hlr_SecretShareData__Output,
} from "../hlr/SecretShareData";

export interface SecretShareResp {
  shares?: _hlr_SecretShareData[];
}

export interface SecretShareResp__Output {
  shares: _hlr_SecretShareData__Output[];
}
