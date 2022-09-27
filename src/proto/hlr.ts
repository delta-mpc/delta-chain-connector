import type * as grpc from "@grpc/grpc-js";
import type { EnumTypeDefinition, MessageTypeDefinition } from "@grpc/proto-loader";

import type { HLRClient as _hlr_HLRClient, HLRDefinition as _hlr_HLRDefinition } from "./hlr/HLR";

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  hlr: {
    AggregationReq: MessageTypeDefinition;
    CalculationReq: MessageTypeDefinition;
    CandidatesReq: MessageTypeDefinition;
    ConfirmReq: MessageTypeDefinition;
    CreateTaskReq: MessageTypeDefinition;
    CreateTaskResp: MessageTypeDefinition;
    EndRoundReq: MessageTypeDefinition;
    FinishTaskReq: MessageTypeDefinition;
    HLR: SubtypeConstructor<typeof grpc.Client, _hlr_HLRClient> & { service: _hlr_HLRDefinition };
    JoinRoundReq: MessageTypeDefinition;
    PublicKeyReq: MessageTypeDefinition;
    PublicKeyResp: MessageTypeDefinition;
    PublicKeys: MessageTypeDefinition;
    ResultCommitment: MessageTypeDefinition;
    ResultCommitmentReq: MessageTypeDefinition;
    ResultCommitmentResp: MessageTypeDefinition;
    RoundStatus: EnumTypeDefinition;
    SecretShareData: MessageTypeDefinition;
    SecretShareReq: MessageTypeDefinition;
    SecretShareResp: MessageTypeDefinition;
    Share: MessageTypeDefinition;
    ShareCommitment: MessageTypeDefinition;
    StartRoundReq: MessageTypeDefinition;
    TaskReq: MessageTypeDefinition;
    TaskResp: MessageTypeDefinition;
    TaskRoundReq: MessageTypeDefinition;
    TaskRoundResp: MessageTypeDefinition;
    VerifyReq: MessageTypeDefinition;
    VerifyResp: MessageTypeDefinition;
    VerifyState: MessageTypeDefinition;
    WeightCommitmentReq: MessageTypeDefinition;
    WeightCommitmentResp: MessageTypeDefinition;
  };
  transaction: {
    Transaction: MessageTypeDefinition;
  };
}
