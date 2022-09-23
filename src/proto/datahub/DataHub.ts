// Original file: src/proto/datahub.proto

import type * as grpc from "@grpc/grpc-js";
import type { MethodDefinition } from "@grpc/proto-loader";
import type {
  DataCommitmentReq as _datahub_DataCommitmentReq,
  DataCommitmentReq__Output as _datahub_DataCommitmentReq__Output,
} from "../datahub/DataCommitmentReq";
import type {
  DataCommitmentResp as _datahub_DataCommitmentResp,
  DataCommitmentResp__Output as _datahub_DataCommitmentResp__Output,
} from "../datahub/DataCommitmentResp";
import type {
  RegisterReq as _datahub_RegisterReq,
  RegisterReq__Output as _datahub_RegisterReq__Output,
} from "../datahub/RegisterReq";
import type {
  Transaction as _transaction_Transaction,
  Transaction__Output as _transaction_Transaction__Output,
} from "../transaction/Transaction";

export interface DataHubClient extends grpc.Client {
  GetDataCommitment(
    argument: _datahub_DataCommitmentReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_datahub_DataCommitmentResp__Output>
  ): grpc.ClientUnaryCall;
  GetDataCommitment(
    argument: _datahub_DataCommitmentReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_datahub_DataCommitmentResp__Output>
  ): grpc.ClientUnaryCall;
  GetDataCommitment(
    argument: _datahub_DataCommitmentReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_datahub_DataCommitmentResp__Output>
  ): grpc.ClientUnaryCall;
  GetDataCommitment(
    argument: _datahub_DataCommitmentReq,
    callback: grpc.requestCallback<_datahub_DataCommitmentResp__Output>
  ): grpc.ClientUnaryCall;
  getDataCommitment(
    argument: _datahub_DataCommitmentReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_datahub_DataCommitmentResp__Output>
  ): grpc.ClientUnaryCall;
  getDataCommitment(
    argument: _datahub_DataCommitmentReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_datahub_DataCommitmentResp__Output>
  ): grpc.ClientUnaryCall;
  getDataCommitment(
    argument: _datahub_DataCommitmentReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_datahub_DataCommitmentResp__Output>
  ): grpc.ClientUnaryCall;
  getDataCommitment(
    argument: _datahub_DataCommitmentReq,
    callback: grpc.requestCallback<_datahub_DataCommitmentResp__Output>
  ): grpc.ClientUnaryCall;

  Register(
    argument: _datahub_RegisterReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  Register(
    argument: _datahub_RegisterReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  Register(
    argument: _datahub_RegisterReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  Register(
    argument: _datahub_RegisterReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  register(
    argument: _datahub_RegisterReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  register(
    argument: _datahub_RegisterReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  register(
    argument: _datahub_RegisterReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  register(
    argument: _datahub_RegisterReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
}

export interface DataHubHandlers extends grpc.UntypedServiceImplementation {
  GetDataCommitment: grpc.handleUnaryCall<_datahub_DataCommitmentReq__Output, _datahub_DataCommitmentResp>;

  Register: grpc.handleUnaryCall<_datahub_RegisterReq__Output, _transaction_Transaction>;
}

export interface DataHubDefinition extends grpc.ServiceDefinition {
  GetDataCommitment: MethodDefinition<
    _datahub_DataCommitmentReq,
    _datahub_DataCommitmentResp,
    _datahub_DataCommitmentReq__Output,
    _datahub_DataCommitmentResp__Output
  >;
  Register: MethodDefinition<
    _datahub_RegisterReq,
    _transaction_Transaction,
    _datahub_RegisterReq__Output,
    _transaction_Transaction__Output
  >;
}
