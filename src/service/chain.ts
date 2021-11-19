import type * as grpc from "@grpc/grpc-js";
import type { EnumTypeDefinition, MessageTypeDefinition } from "@grpc/proto-loader";

import type {
  ChainClient as _chain_ChainClient,
  ChainDefinition as _chain_ChainDefinition,
} from "./chain/Chain";

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  chain: {
    AggregationReq: MessageTypeDefinition;
    AggregationStartedEvent: MessageTypeDefinition;
    CalculationReq: MessageTypeDefinition;
    CalculationStartedEvent: MessageTypeDefinition;
    CandidatesReq: MessageTypeDefinition;
    Chain: SubtypeConstructor<typeof grpc.Client, _chain_ChainClient> & { service: _chain_ChainDefinition };
    CreateTaskReq: MessageTypeDefinition;
    CreateTaskResp: MessageTypeDefinition;
    Empty: MessageTypeDefinition;
    EndRoundReq: MessageTypeDefinition;
    Event: MessageTypeDefinition;
    EventReq: MessageTypeDefinition;
    JoinReq: MessageTypeDefinition;
    JoinResp: MessageTypeDefinition;
    JoinRoundReq: MessageTypeDefinition;
    LeaveReq: MessageTypeDefinition;
    NodeInfoReq: MessageTypeDefinition;
    NodeInfoResp: MessageTypeDefinition;
    PartnerSelectedEvent: MessageTypeDefinition;
    PublicKeyReq: MessageTypeDefinition;
    PublicKeyResp: MessageTypeDefinition;
    ResultCommitment: MessageTypeDefinition;
    ResultCommitmentReq: MessageTypeDefinition;
    ResultCommitmentResp: MessageTypeDefinition;
    RoundEndedEvent: MessageTypeDefinition;
    RoundStartedEvent: MessageTypeDefinition;
    RoundStatus: EnumTypeDefinition;
    SecretShareReq: MessageTypeDefinition;
    SecretShareResp: MessageTypeDefinition;
    Share: MessageTypeDefinition;
    ShareCommitment: MessageTypeDefinition;
    StartRoundReq: MessageTypeDefinition;
    TaskCreateEvent: MessageTypeDefinition;
    TaskRoundReq: MessageTypeDefinition;
    TaskRoundResp: MessageTypeDefinition;
    UpdateNameReq: MessageTypeDefinition;
    UpdateUrlReq: MessageTypeDefinition;
  };
}
