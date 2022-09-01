// Original file: src/proto/identity.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { JoinReq as _identity_JoinReq, JoinReq__Output as _identity_JoinReq__Output } from '../identity/JoinReq';
import type { JoinResp as _identity_JoinResp, JoinResp__Output as _identity_JoinResp__Output } from '../identity/JoinResp';
import type { LeaveReq as _identity_LeaveReq, LeaveReq__Output as _identity_LeaveReq__Output } from '../identity/LeaveReq';
import type { NodeInfo as _identity_NodeInfo, NodeInfo__Output as _identity_NodeInfo__Output } from '../identity/NodeInfo';
import type { NodeInfoReq as _identity_NodeInfoReq, NodeInfoReq__Output as _identity_NodeInfoReq__Output } from '../identity/NodeInfoReq';
import type { NodeInfos as _identity_NodeInfos, NodeInfos__Output as _identity_NodeInfos__Output } from '../identity/NodeInfos';
import type { NodeInfosReq as _identity_NodeInfosReq, NodeInfosReq__Output as _identity_NodeInfosReq__Output } from '../identity/NodeInfosReq';
import type { Transaction as _transaction_Transaction, Transaction__Output as _transaction_Transaction__Output } from '../transaction/Transaction';
import type { UpdateNameReq as _identity_UpdateNameReq, UpdateNameReq__Output as _identity_UpdateNameReq__Output } from '../identity/UpdateNameReq';
import type { UpdateUrlReq as _identity_UpdateUrlReq, UpdateUrlReq__Output as _identity_UpdateUrlReq__Output } from '../identity/UpdateUrlReq';

export interface IdentityClient extends grpc.Client {
  GetNodeInfo(argument: _identity_NodeInfoReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _identity_NodeInfo__Output) => void): grpc.ClientUnaryCall;
  GetNodeInfo(argument: _identity_NodeInfoReq, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _identity_NodeInfo__Output) => void): grpc.ClientUnaryCall;
  GetNodeInfo(argument: _identity_NodeInfoReq, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _identity_NodeInfo__Output) => void): grpc.ClientUnaryCall;
  GetNodeInfo(argument: _identity_NodeInfoReq, callback: (error?: grpc.ServiceError, result?: _identity_NodeInfo__Output) => void): grpc.ClientUnaryCall;
  getNodeInfo(argument: _identity_NodeInfoReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _identity_NodeInfo__Output) => void): grpc.ClientUnaryCall;
  getNodeInfo(argument: _identity_NodeInfoReq, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _identity_NodeInfo__Output) => void): grpc.ClientUnaryCall;
  getNodeInfo(argument: _identity_NodeInfoReq, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _identity_NodeInfo__Output) => void): grpc.ClientUnaryCall;
  getNodeInfo(argument: _identity_NodeInfoReq, callback: (error?: grpc.ServiceError, result?: _identity_NodeInfo__Output) => void): grpc.ClientUnaryCall;
  
  GetNodes(argument: _identity_NodeInfosReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _identity_NodeInfos__Output) => void): grpc.ClientUnaryCall;
  GetNodes(argument: _identity_NodeInfosReq, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _identity_NodeInfos__Output) => void): grpc.ClientUnaryCall;
  GetNodes(argument: _identity_NodeInfosReq, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _identity_NodeInfos__Output) => void): grpc.ClientUnaryCall;
  GetNodes(argument: _identity_NodeInfosReq, callback: (error?: grpc.ServiceError, result?: _identity_NodeInfos__Output) => void): grpc.ClientUnaryCall;
  getNodes(argument: _identity_NodeInfosReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _identity_NodeInfos__Output) => void): grpc.ClientUnaryCall;
  getNodes(argument: _identity_NodeInfosReq, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _identity_NodeInfos__Output) => void): grpc.ClientUnaryCall;
  getNodes(argument: _identity_NodeInfosReq, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _identity_NodeInfos__Output) => void): grpc.ClientUnaryCall;
  getNodes(argument: _identity_NodeInfosReq, callback: (error?: grpc.ServiceError, result?: _identity_NodeInfos__Output) => void): grpc.ClientUnaryCall;
  
  Join(argument: _identity_JoinReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _identity_JoinResp__Output) => void): grpc.ClientUnaryCall;
  Join(argument: _identity_JoinReq, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _identity_JoinResp__Output) => void): grpc.ClientUnaryCall;
  Join(argument: _identity_JoinReq, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _identity_JoinResp__Output) => void): grpc.ClientUnaryCall;
  Join(argument: _identity_JoinReq, callback: (error?: grpc.ServiceError, result?: _identity_JoinResp__Output) => void): grpc.ClientUnaryCall;
  join(argument: _identity_JoinReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _identity_JoinResp__Output) => void): grpc.ClientUnaryCall;
  join(argument: _identity_JoinReq, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _identity_JoinResp__Output) => void): grpc.ClientUnaryCall;
  join(argument: _identity_JoinReq, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _identity_JoinResp__Output) => void): grpc.ClientUnaryCall;
  join(argument: _identity_JoinReq, callback: (error?: grpc.ServiceError, result?: _identity_JoinResp__Output) => void): grpc.ClientUnaryCall;
  
  Leave(argument: _identity_LeaveReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _transaction_Transaction__Output) => void): grpc.ClientUnaryCall;
  Leave(argument: _identity_LeaveReq, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _transaction_Transaction__Output) => void): grpc.ClientUnaryCall;
  Leave(argument: _identity_LeaveReq, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _transaction_Transaction__Output) => void): grpc.ClientUnaryCall;
  Leave(argument: _identity_LeaveReq, callback: (error?: grpc.ServiceError, result?: _transaction_Transaction__Output) => void): grpc.ClientUnaryCall;
  leave(argument: _identity_LeaveReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _transaction_Transaction__Output) => void): grpc.ClientUnaryCall;
  leave(argument: _identity_LeaveReq, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _transaction_Transaction__Output) => void): grpc.ClientUnaryCall;
  leave(argument: _identity_LeaveReq, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _transaction_Transaction__Output) => void): grpc.ClientUnaryCall;
  leave(argument: _identity_LeaveReq, callback: (error?: grpc.ServiceError, result?: _transaction_Transaction__Output) => void): grpc.ClientUnaryCall;
  
  UpdateName(argument: _identity_UpdateNameReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _transaction_Transaction__Output) => void): grpc.ClientUnaryCall;
  UpdateName(argument: _identity_UpdateNameReq, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _transaction_Transaction__Output) => void): grpc.ClientUnaryCall;
  UpdateName(argument: _identity_UpdateNameReq, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _transaction_Transaction__Output) => void): grpc.ClientUnaryCall;
  UpdateName(argument: _identity_UpdateNameReq, callback: (error?: grpc.ServiceError, result?: _transaction_Transaction__Output) => void): grpc.ClientUnaryCall;
  updateName(argument: _identity_UpdateNameReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _transaction_Transaction__Output) => void): grpc.ClientUnaryCall;
  updateName(argument: _identity_UpdateNameReq, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _transaction_Transaction__Output) => void): grpc.ClientUnaryCall;
  updateName(argument: _identity_UpdateNameReq, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _transaction_Transaction__Output) => void): grpc.ClientUnaryCall;
  updateName(argument: _identity_UpdateNameReq, callback: (error?: grpc.ServiceError, result?: _transaction_Transaction__Output) => void): grpc.ClientUnaryCall;
  
  UpdateUrl(argument: _identity_UpdateUrlReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _transaction_Transaction__Output) => void): grpc.ClientUnaryCall;
  UpdateUrl(argument: _identity_UpdateUrlReq, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _transaction_Transaction__Output) => void): grpc.ClientUnaryCall;
  UpdateUrl(argument: _identity_UpdateUrlReq, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _transaction_Transaction__Output) => void): grpc.ClientUnaryCall;
  UpdateUrl(argument: _identity_UpdateUrlReq, callback: (error?: grpc.ServiceError, result?: _transaction_Transaction__Output) => void): grpc.ClientUnaryCall;
  updateUrl(argument: _identity_UpdateUrlReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _transaction_Transaction__Output) => void): grpc.ClientUnaryCall;
  updateUrl(argument: _identity_UpdateUrlReq, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _transaction_Transaction__Output) => void): grpc.ClientUnaryCall;
  updateUrl(argument: _identity_UpdateUrlReq, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _transaction_Transaction__Output) => void): grpc.ClientUnaryCall;
  updateUrl(argument: _identity_UpdateUrlReq, callback: (error?: grpc.ServiceError, result?: _transaction_Transaction__Output) => void): grpc.ClientUnaryCall;
  
}

export interface IdentityHandlers extends grpc.UntypedServiceImplementation {
  GetNodeInfo: grpc.handleUnaryCall<_identity_NodeInfoReq__Output, _identity_NodeInfo>;
  
  GetNodes: grpc.handleUnaryCall<_identity_NodeInfosReq__Output, _identity_NodeInfos>;
  
  Join: grpc.handleUnaryCall<_identity_JoinReq__Output, _identity_JoinResp>;
  
  Leave: grpc.handleUnaryCall<_identity_LeaveReq__Output, _transaction_Transaction>;
  
  UpdateName: grpc.handleUnaryCall<_identity_UpdateNameReq__Output, _transaction_Transaction>;
  
  UpdateUrl: grpc.handleUnaryCall<_identity_UpdateUrlReq__Output, _transaction_Transaction>;
  
}

export interface IdentityDefinition extends grpc.ServiceDefinition {
  GetNodeInfo: MethodDefinition<_identity_NodeInfoReq, _identity_NodeInfo, _identity_NodeInfoReq__Output, _identity_NodeInfo__Output>
  GetNodes: MethodDefinition<_identity_NodeInfosReq, _identity_NodeInfos, _identity_NodeInfosReq__Output, _identity_NodeInfos__Output>
  Join: MethodDefinition<_identity_JoinReq, _identity_JoinResp, _identity_JoinReq__Output, _identity_JoinResp__Output>
  Leave: MethodDefinition<_identity_LeaveReq, _transaction_Transaction, _identity_LeaveReq__Output, _transaction_Transaction__Output>
  UpdateName: MethodDefinition<_identity_UpdateNameReq, _transaction_Transaction, _identity_UpdateNameReq__Output, _transaction_Transaction__Output>
  UpdateUrl: MethodDefinition<_identity_UpdateUrlReq, _transaction_Transaction, _identity_UpdateUrlReq__Output, _transaction_Transaction__Output>
}
