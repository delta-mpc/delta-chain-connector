import type * as grpc from "@grpc/grpc-js";
import type { MessageTypeDefinition } from "@grpc/proto-loader";

import type {
  IdentityClient as _identity_IdentityClient,
  IdentityDefinition as _identity_IdentityDefinition,
} from "./identity/Identity";

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  identity: {
    Identity: SubtypeConstructor<typeof grpc.Client, _identity_IdentityClient> & {
      service: _identity_IdentityDefinition;
    };
    JoinReq: MessageTypeDefinition;
    JoinResp: MessageTypeDefinition;
    LeaveReq: MessageTypeDefinition;
    NodeInfo: MessageTypeDefinition;
    NodeInfoReq: MessageTypeDefinition;
    NodeInfos: MessageTypeDefinition;
    NodeInfosReq: MessageTypeDefinition;
    UpdateNameReq: MessageTypeDefinition;
    UpdateUrlReq: MessageTypeDefinition;
  };
  transaction: {
    Transaction: MessageTypeDefinition;
  };
}
