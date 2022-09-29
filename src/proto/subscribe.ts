import type * as grpc from "@grpc/grpc-js";
import type { MessageTypeDefinition } from "@grpc/proto-loader";

import type {
  SubscribeClient as _subscribe_SubscribeClient,
  SubscribeDefinition as _subscribe_SubscribeDefinition,
} from "./subscribe/Subscribe";

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  subscribe: {
    AggregationStartedEvent: MessageTypeDefinition;
    CalculationStartedEvent: MessageTypeDefinition;
    DataRegisteredEvent: MessageTypeDefinition;
    Event: MessageTypeDefinition;
    EventReq: MessageTypeDefinition;
    HeartBeatEvent: MessageTypeDefinition;
    PartnerSelectedEvent: MessageTypeDefinition;
    RoundEndedEvent: MessageTypeDefinition;
    RoundStartedEvent: MessageTypeDefinition;
    Subscribe: SubtypeConstructor<typeof grpc.Client, _subscribe_SubscribeClient> & {
      service: _subscribe_SubscribeDefinition;
    };
    TaskCreateEvent: MessageTypeDefinition;
    TaskFinishEvent: MessageTypeDefinition;
    TaskMemberVerifiedEvent: MessageTypeDefinition;
    TaskVerificationConfirmedEvent: MessageTypeDefinition;
  };
}
