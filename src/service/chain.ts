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
    EndRoundReq: MessageTypeDefinition;
    Event: MessageTypeDefinition;
    EventReq: MessageTypeDefinition;
    FinishTaskReq: MessageTypeDefinition;
    JoinReq: MessageTypeDefinition;
    JoinResp: MessageTypeDefinition;
    JoinRoundReq: MessageTypeDefinition;
    LeaveReq: MessageTypeDefinition;
    NodeInfo: MessageTypeDefinition;
    NodeInfoReq: MessageTypeDefinition;
    NodeInfos: MessageTypeDefinition;
    NodeInfosReq: MessageTypeDefinition;
    PartnerSelectedEvent: MessageTypeDefinition;
    PublicKeyReq: MessageTypeDefinition;
    PublicKeyResp: MessageTypeDefinition;
    PublicKeys: MessageTypeDefinition;
    ResultCommitment: MessageTypeDefinition;
    ResultCommitmentReq: MessageTypeDefinition;
    ResultCommitmentResp: MessageTypeDefinition;
    RoundEndedEvent: MessageTypeDefinition;
    RoundStartedEvent: MessageTypeDefinition;
    RoundStatus: EnumTypeDefinition;
    SecretShareData: MessageTypeDefinition;
    SecretShareReq: MessageTypeDefinition;
    SecretShareResp: MessageTypeDefinition;
    Share: MessageTypeDefinition;
    ShareCommitment: MessageTypeDefinition;
    StartRoundReq: MessageTypeDefinition;
    TaskCreateEvent: MessageTypeDefinition;
    TaskFinishEvent: MessageTypeDefinition;
    TaskReq: MessageTypeDefinition;
    TaskResp: MessageTypeDefinition;
    TaskRoundReq: MessageTypeDefinition;
    TaskRoundResp: MessageTypeDefinition;
    Transaction: MessageTypeDefinition;
    UpdateNameReq: MessageTypeDefinition;
    UpdateUrlReq: MessageTypeDefinition;
  };
}
