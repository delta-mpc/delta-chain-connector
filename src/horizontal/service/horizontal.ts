import type * as grpc from "@grpc/grpc-js";
import type { EnumTypeDefinition, MessageTypeDefinition } from "@grpc/proto-loader";

import type {
  HorizontalClient as _horizontal_HorizontalClient,
  HorizontalDefinition as _horizontal_HorizontalDefinition,
} from "./horizontal/Horizontal";

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  horizontal: {
    AggregationReq: MessageTypeDefinition;
    AggregationStartedEvent: MessageTypeDefinition;
    CalculationReq: MessageTypeDefinition;
    CalculationStartedEvent: MessageTypeDefinition;
    CandidatesReq: MessageTypeDefinition;
    CreateTaskReq: MessageTypeDefinition;
    CreateTaskResp: MessageTypeDefinition;
    EndRoundReq: MessageTypeDefinition;
    Event: MessageTypeDefinition;
    EventReq: MessageTypeDefinition;
    FinishTaskReq: MessageTypeDefinition;
    HeartBeatEvent: MessageTypeDefinition;
    Horizontal: SubtypeConstructor<typeof grpc.Client, _horizontal_HorizontalClient> & {
      service: _horizontal_HorizontalDefinition;
    };
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
