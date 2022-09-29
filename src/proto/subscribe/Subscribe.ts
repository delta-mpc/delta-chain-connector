// Original file: src/proto/subscribe.proto

import type * as grpc from "@grpc/grpc-js";
import type { MethodDefinition } from "@grpc/proto-loader";
import type {
  Event as _subscribe_Event,
  Event__Output as _subscribe_Event__Output,
} from "../subscribe/Event";
import type {
  EventReq as _subscribe_EventReq,
  EventReq__Output as _subscribe_EventReq__Output,
} from "../subscribe/EventReq";

export interface SubscribeClient extends grpc.Client {
  Subscribe(
    argument: _subscribe_EventReq,
    metadata: grpc.Metadata,
    options?: grpc.CallOptions
  ): grpc.ClientReadableStream<_subscribe_Event__Output>;
  Subscribe(
    argument: _subscribe_EventReq,
    options?: grpc.CallOptions
  ): grpc.ClientReadableStream<_subscribe_Event__Output>;
  subscribe(
    argument: _subscribe_EventReq,
    metadata: grpc.Metadata,
    options?: grpc.CallOptions
  ): grpc.ClientReadableStream<_subscribe_Event__Output>;
  subscribe(
    argument: _subscribe_EventReq,
    options?: grpc.CallOptions
  ): grpc.ClientReadableStream<_subscribe_Event__Output>;
}

export interface SubscribeHandlers extends grpc.UntypedServiceImplementation {
  Subscribe: grpc.handleServerStreamingCall<_subscribe_EventReq__Output, _subscribe_Event>;
}

export interface SubscribeDefinition extends grpc.ServiceDefinition {
  Subscribe: MethodDefinition<
    _subscribe_EventReq,
    _subscribe_Event,
    _subscribe_EventReq__Output,
    _subscribe_Event__Output
  >;
}
