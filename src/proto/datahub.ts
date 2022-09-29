import type * as grpc from "@grpc/grpc-js";
import type { MessageTypeDefinition } from "@grpc/proto-loader";

import type {
  DataHubClient as _datahub_DataHubClient,
  DataHubDefinition as _datahub_DataHubDefinition,
} from "./datahub/DataHub";

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  datahub: {
    DataCommitmentReq: MessageTypeDefinition;
    DataCommitmentResp: MessageTypeDefinition;
    DataHub: SubtypeConstructor<typeof grpc.Client, _datahub_DataHubClient> & {
      service: _datahub_DataHubDefinition;
    };
    RegisterReq: MessageTypeDefinition;
  };
  transaction: {
    Transaction: MessageTypeDefinition;
  };
}
