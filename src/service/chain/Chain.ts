// Original file: src/service/chain.proto

import type * as grpc from "@grpc/grpc-js";
import type { MethodDefinition } from "@grpc/proto-loader";
import type {
  AggregationReq as _chain_AggregationReq,
  AggregationReq__Output as _chain_AggregationReq__Output,
} from "../chain/AggregationReq";
import type {
  CalculationReq as _chain_CalculationReq,
  CalculationReq__Output as _chain_CalculationReq__Output,
} from "../chain/CalculationReq";
import type {
  CandidatesReq as _chain_CandidatesReq,
  CandidatesReq__Output as _chain_CandidatesReq__Output,
} from "../chain/CandidatesReq";
import type {
  CreateTaskReq as _chain_CreateTaskReq,
  CreateTaskReq__Output as _chain_CreateTaskReq__Output,
} from "../chain/CreateTaskReq";
import type {
  CreateTaskResp as _chain_CreateTaskResp,
  CreateTaskResp__Output as _chain_CreateTaskResp__Output,
} from "../chain/CreateTaskResp";
import type {
  EndRoundReq as _chain_EndRoundReq,
  EndRoundReq__Output as _chain_EndRoundReq__Output,
} from "../chain/EndRoundReq";
import type { Event as _chain_Event, Event__Output as _chain_Event__Output } from "../chain/Event";
import type {
  EventReq as _chain_EventReq,
  EventReq__Output as _chain_EventReq__Output,
} from "../chain/EventReq";
import type {
  FinishTaskReq as _chain_FinishTaskReq,
  FinishTaskReq__Output as _chain_FinishTaskReq__Output,
} from "../chain/FinishTaskReq";
import type { JoinReq as _chain_JoinReq, JoinReq__Output as _chain_JoinReq__Output } from "../chain/JoinReq";
import type {
  JoinResp as _chain_JoinResp,
  JoinResp__Output as _chain_JoinResp__Output,
} from "../chain/JoinResp";
import type {
  JoinRoundReq as _chain_JoinRoundReq,
  JoinRoundReq__Output as _chain_JoinRoundReq__Output,
} from "../chain/JoinRoundReq";
import type {
  LeaveReq as _chain_LeaveReq,
  LeaveReq__Output as _chain_LeaveReq__Output,
} from "../chain/LeaveReq";
import type {
  NodeInfo as _chain_NodeInfo,
  NodeInfo__Output as _chain_NodeInfo__Output,
} from "../chain/NodeInfo";
import type {
  NodeInfoReq as _chain_NodeInfoReq,
  NodeInfoReq__Output as _chain_NodeInfoReq__Output,
} from "../chain/NodeInfoReq";
import type {
  NodeInfos as _chain_NodeInfos,
  NodeInfos__Output as _chain_NodeInfos__Output,
} from "../chain/NodeInfos";
import type {
  NodeInfosReq as _chain_NodeInfosReq,
  NodeInfosReq__Output as _chain_NodeInfosReq__Output,
} from "../chain/NodeInfosReq";
import type {
  PublicKeyReq as _chain_PublicKeyReq,
  PublicKeyReq__Output as _chain_PublicKeyReq__Output,
} from "../chain/PublicKeyReq";
import type {
  PublicKeyResp as _chain_PublicKeyResp,
  PublicKeyResp__Output as _chain_PublicKeyResp__Output,
} from "../chain/PublicKeyResp";
import type {
  ResultCommitment as _chain_ResultCommitment,
  ResultCommitment__Output as _chain_ResultCommitment__Output,
} from "../chain/ResultCommitment";
import type {
  ResultCommitmentReq as _chain_ResultCommitmentReq,
  ResultCommitmentReq__Output as _chain_ResultCommitmentReq__Output,
} from "../chain/ResultCommitmentReq";
import type {
  ResultCommitmentResp as _chain_ResultCommitmentResp,
  ResultCommitmentResp__Output as _chain_ResultCommitmentResp__Output,
} from "../chain/ResultCommitmentResp";
import type {
  SecretShareReq as _chain_SecretShareReq,
  SecretShareReq__Output as _chain_SecretShareReq__Output,
} from "../chain/SecretShareReq";
import type {
  SecretShareResp as _chain_SecretShareResp,
  SecretShareResp__Output as _chain_SecretShareResp__Output,
} from "../chain/SecretShareResp";
import type { Share as _chain_Share, Share__Output as _chain_Share__Output } from "../chain/Share";
import type {
  ShareCommitment as _chain_ShareCommitment,
  ShareCommitment__Output as _chain_ShareCommitment__Output,
} from "../chain/ShareCommitment";
import type {
  StartRoundReq as _chain_StartRoundReq,
  StartRoundReq__Output as _chain_StartRoundReq__Output,
} from "../chain/StartRoundReq";
import type { TaskReq as _chain_TaskReq, TaskReq__Output as _chain_TaskReq__Output } from "../chain/TaskReq";
import type {
  TaskResp as _chain_TaskResp,
  TaskResp__Output as _chain_TaskResp__Output,
} from "../chain/TaskResp";
import type {
  TaskRoundReq as _chain_TaskRoundReq,
  TaskRoundReq__Output as _chain_TaskRoundReq__Output,
} from "../chain/TaskRoundReq";
import type {
  TaskRoundResp as _chain_TaskRoundResp,
  TaskRoundResp__Output as _chain_TaskRoundResp__Output,
} from "../chain/TaskRoundResp";
import type {
  Transaction as _chain_Transaction,
  Transaction__Output as _chain_Transaction__Output,
} from "../chain/Transaction";
import type {
  UpdateNameReq as _chain_UpdateNameReq,
  UpdateNameReq__Output as _chain_UpdateNameReq__Output,
} from "../chain/UpdateNameReq";
import type {
  UpdateUrlReq as _chain_UpdateUrlReq,
  UpdateUrlReq__Output as _chain_UpdateUrlReq__Output,
} from "../chain/UpdateUrlReq";

export interface ChainClient extends grpc.Client {
  CreateTask(
    argument: _chain_CreateTaskReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_CreateTaskResp__Output) => void
  ): grpc.ClientUnaryCall;
  CreateTask(
    argument: _chain_CreateTaskReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_CreateTaskResp__Output) => void
  ): grpc.ClientUnaryCall;
  CreateTask(
    argument: _chain_CreateTaskReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_CreateTaskResp__Output) => void
  ): grpc.ClientUnaryCall;
  CreateTask(
    argument: _chain_CreateTaskReq,
    callback: (error?: grpc.ServiceError, result?: _chain_CreateTaskResp__Output) => void
  ): grpc.ClientUnaryCall;
  createTask(
    argument: _chain_CreateTaskReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_CreateTaskResp__Output) => void
  ): grpc.ClientUnaryCall;
  createTask(
    argument: _chain_CreateTaskReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_CreateTaskResp__Output) => void
  ): grpc.ClientUnaryCall;
  createTask(
    argument: _chain_CreateTaskReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_CreateTaskResp__Output) => void
  ): grpc.ClientUnaryCall;
  createTask(
    argument: _chain_CreateTaskReq,
    callback: (error?: grpc.ServiceError, result?: _chain_CreateTaskResp__Output) => void
  ): grpc.ClientUnaryCall;

  EndRound(
    argument: _chain_EndRoundReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  EndRound(
    argument: _chain_EndRoundReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  EndRound(
    argument: _chain_EndRoundReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  EndRound(
    argument: _chain_EndRoundReq,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  endRound(
    argument: _chain_EndRoundReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  endRound(
    argument: _chain_EndRoundReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  endRound(
    argument: _chain_EndRoundReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  endRound(
    argument: _chain_EndRoundReq,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;

  FinishTask(
    argument: _chain_FinishTaskReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  FinishTask(
    argument: _chain_FinishTaskReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  FinishTask(
    argument: _chain_FinishTaskReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  FinishTask(
    argument: _chain_FinishTaskReq,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  finishTask(
    argument: _chain_FinishTaskReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  finishTask(
    argument: _chain_FinishTaskReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  finishTask(
    argument: _chain_FinishTaskReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  finishTask(
    argument: _chain_FinishTaskReq,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;

  GetClientPublickKeys(
    argument: _chain_PublicKeyReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_PublicKeyResp__Output) => void
  ): grpc.ClientUnaryCall;
  GetClientPublickKeys(
    argument: _chain_PublicKeyReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_PublicKeyResp__Output) => void
  ): grpc.ClientUnaryCall;
  GetClientPublickKeys(
    argument: _chain_PublicKeyReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_PublicKeyResp__Output) => void
  ): grpc.ClientUnaryCall;
  GetClientPublickKeys(
    argument: _chain_PublicKeyReq,
    callback: (error?: grpc.ServiceError, result?: _chain_PublicKeyResp__Output) => void
  ): grpc.ClientUnaryCall;
  getClientPublickKeys(
    argument: _chain_PublicKeyReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_PublicKeyResp__Output) => void
  ): grpc.ClientUnaryCall;
  getClientPublickKeys(
    argument: _chain_PublicKeyReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_PublicKeyResp__Output) => void
  ): grpc.ClientUnaryCall;
  getClientPublickKeys(
    argument: _chain_PublicKeyReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_PublicKeyResp__Output) => void
  ): grpc.ClientUnaryCall;
  getClientPublickKeys(
    argument: _chain_PublicKeyReq,
    callback: (error?: grpc.ServiceError, result?: _chain_PublicKeyResp__Output) => void
  ): grpc.ClientUnaryCall;

  GetNodeInfo(
    argument: _chain_NodeInfoReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_NodeInfo__Output) => void
  ): grpc.ClientUnaryCall;
  GetNodeInfo(
    argument: _chain_NodeInfoReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_NodeInfo__Output) => void
  ): grpc.ClientUnaryCall;
  GetNodeInfo(
    argument: _chain_NodeInfoReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_NodeInfo__Output) => void
  ): grpc.ClientUnaryCall;
  GetNodeInfo(
    argument: _chain_NodeInfoReq,
    callback: (error?: grpc.ServiceError, result?: _chain_NodeInfo__Output) => void
  ): grpc.ClientUnaryCall;
  getNodeInfo(
    argument: _chain_NodeInfoReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_NodeInfo__Output) => void
  ): grpc.ClientUnaryCall;
  getNodeInfo(
    argument: _chain_NodeInfoReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_NodeInfo__Output) => void
  ): grpc.ClientUnaryCall;
  getNodeInfo(
    argument: _chain_NodeInfoReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_NodeInfo__Output) => void
  ): grpc.ClientUnaryCall;
  getNodeInfo(
    argument: _chain_NodeInfoReq,
    callback: (error?: grpc.ServiceError, result?: _chain_NodeInfo__Output) => void
  ): grpc.ClientUnaryCall;

  GetNodes(
    argument: _chain_NodeInfosReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_NodeInfos__Output) => void
  ): grpc.ClientUnaryCall;
  GetNodes(
    argument: _chain_NodeInfosReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_NodeInfos__Output) => void
  ): grpc.ClientUnaryCall;
  GetNodes(
    argument: _chain_NodeInfosReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_NodeInfos__Output) => void
  ): grpc.ClientUnaryCall;
  GetNodes(
    argument: _chain_NodeInfosReq,
    callback: (error?: grpc.ServiceError, result?: _chain_NodeInfos__Output) => void
  ): grpc.ClientUnaryCall;
  getNodes(
    argument: _chain_NodeInfosReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_NodeInfos__Output) => void
  ): grpc.ClientUnaryCall;
  getNodes(
    argument: _chain_NodeInfosReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_NodeInfos__Output) => void
  ): grpc.ClientUnaryCall;
  getNodes(
    argument: _chain_NodeInfosReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_NodeInfos__Output) => void
  ): grpc.ClientUnaryCall;
  getNodes(
    argument: _chain_NodeInfosReq,
    callback: (error?: grpc.ServiceError, result?: _chain_NodeInfos__Output) => void
  ): grpc.ClientUnaryCall;

  GetResultCommitment(
    argument: _chain_ResultCommitmentReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_ResultCommitmentResp__Output) => void
  ): grpc.ClientUnaryCall;
  GetResultCommitment(
    argument: _chain_ResultCommitmentReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_ResultCommitmentResp__Output) => void
  ): grpc.ClientUnaryCall;
  GetResultCommitment(
    argument: _chain_ResultCommitmentReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_ResultCommitmentResp__Output) => void
  ): grpc.ClientUnaryCall;
  GetResultCommitment(
    argument: _chain_ResultCommitmentReq,
    callback: (error?: grpc.ServiceError, result?: _chain_ResultCommitmentResp__Output) => void
  ): grpc.ClientUnaryCall;
  getResultCommitment(
    argument: _chain_ResultCommitmentReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_ResultCommitmentResp__Output) => void
  ): grpc.ClientUnaryCall;
  getResultCommitment(
    argument: _chain_ResultCommitmentReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_ResultCommitmentResp__Output) => void
  ): grpc.ClientUnaryCall;
  getResultCommitment(
    argument: _chain_ResultCommitmentReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_ResultCommitmentResp__Output) => void
  ): grpc.ClientUnaryCall;
  getResultCommitment(
    argument: _chain_ResultCommitmentReq,
    callback: (error?: grpc.ServiceError, result?: _chain_ResultCommitmentResp__Output) => void
  ): grpc.ClientUnaryCall;

  GetSecretShareDatas(
    argument: _chain_SecretShareReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_SecretShareResp__Output) => void
  ): grpc.ClientUnaryCall;
  GetSecretShareDatas(
    argument: _chain_SecretShareReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_SecretShareResp__Output) => void
  ): grpc.ClientUnaryCall;
  GetSecretShareDatas(
    argument: _chain_SecretShareReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_SecretShareResp__Output) => void
  ): grpc.ClientUnaryCall;
  GetSecretShareDatas(
    argument: _chain_SecretShareReq,
    callback: (error?: grpc.ServiceError, result?: _chain_SecretShareResp__Output) => void
  ): grpc.ClientUnaryCall;
  getSecretShareDatas(
    argument: _chain_SecretShareReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_SecretShareResp__Output) => void
  ): grpc.ClientUnaryCall;
  getSecretShareDatas(
    argument: _chain_SecretShareReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_SecretShareResp__Output) => void
  ): grpc.ClientUnaryCall;
  getSecretShareDatas(
    argument: _chain_SecretShareReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_SecretShareResp__Output) => void
  ): grpc.ClientUnaryCall;
  getSecretShareDatas(
    argument: _chain_SecretShareReq,
    callback: (error?: grpc.ServiceError, result?: _chain_SecretShareResp__Output) => void
  ): grpc.ClientUnaryCall;

  GetTask(
    argument: _chain_TaskReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_TaskResp__Output) => void
  ): grpc.ClientUnaryCall;
  GetTask(
    argument: _chain_TaskReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_TaskResp__Output) => void
  ): grpc.ClientUnaryCall;
  GetTask(
    argument: _chain_TaskReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_TaskResp__Output) => void
  ): grpc.ClientUnaryCall;
  GetTask(
    argument: _chain_TaskReq,
    callback: (error?: grpc.ServiceError, result?: _chain_TaskResp__Output) => void
  ): grpc.ClientUnaryCall;
  getTask(
    argument: _chain_TaskReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_TaskResp__Output) => void
  ): grpc.ClientUnaryCall;
  getTask(
    argument: _chain_TaskReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_TaskResp__Output) => void
  ): grpc.ClientUnaryCall;
  getTask(
    argument: _chain_TaskReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_TaskResp__Output) => void
  ): grpc.ClientUnaryCall;
  getTask(
    argument: _chain_TaskReq,
    callback: (error?: grpc.ServiceError, result?: _chain_TaskResp__Output) => void
  ): grpc.ClientUnaryCall;

  GetTaskRound(
    argument: _chain_TaskRoundReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_TaskRoundResp__Output) => void
  ): grpc.ClientUnaryCall;
  GetTaskRound(
    argument: _chain_TaskRoundReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_TaskRoundResp__Output) => void
  ): grpc.ClientUnaryCall;
  GetTaskRound(
    argument: _chain_TaskRoundReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_TaskRoundResp__Output) => void
  ): grpc.ClientUnaryCall;
  GetTaskRound(
    argument: _chain_TaskRoundReq,
    callback: (error?: grpc.ServiceError, result?: _chain_TaskRoundResp__Output) => void
  ): grpc.ClientUnaryCall;
  getTaskRound(
    argument: _chain_TaskRoundReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_TaskRoundResp__Output) => void
  ): grpc.ClientUnaryCall;
  getTaskRound(
    argument: _chain_TaskRoundReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_TaskRoundResp__Output) => void
  ): grpc.ClientUnaryCall;
  getTaskRound(
    argument: _chain_TaskRoundReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_TaskRoundResp__Output) => void
  ): grpc.ClientUnaryCall;
  getTaskRound(
    argument: _chain_TaskRoundReq,
    callback: (error?: grpc.ServiceError, result?: _chain_TaskRoundResp__Output) => void
  ): grpc.ClientUnaryCall;

  Join(
    argument: _chain_JoinReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_JoinResp__Output) => void
  ): grpc.ClientUnaryCall;
  Join(
    argument: _chain_JoinReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_JoinResp__Output) => void
  ): grpc.ClientUnaryCall;
  Join(
    argument: _chain_JoinReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_JoinResp__Output) => void
  ): grpc.ClientUnaryCall;
  Join(
    argument: _chain_JoinReq,
    callback: (error?: grpc.ServiceError, result?: _chain_JoinResp__Output) => void
  ): grpc.ClientUnaryCall;
  join(
    argument: _chain_JoinReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_JoinResp__Output) => void
  ): grpc.ClientUnaryCall;
  join(
    argument: _chain_JoinReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_JoinResp__Output) => void
  ): grpc.ClientUnaryCall;
  join(
    argument: _chain_JoinReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_JoinResp__Output) => void
  ): grpc.ClientUnaryCall;
  join(
    argument: _chain_JoinReq,
    callback: (error?: grpc.ServiceError, result?: _chain_JoinResp__Output) => void
  ): grpc.ClientUnaryCall;

  JoinRound(
    argument: _chain_JoinRoundReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  JoinRound(
    argument: _chain_JoinRoundReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  JoinRound(
    argument: _chain_JoinRoundReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  JoinRound(
    argument: _chain_JoinRoundReq,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  joinRound(
    argument: _chain_JoinRoundReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  joinRound(
    argument: _chain_JoinRoundReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  joinRound(
    argument: _chain_JoinRoundReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  joinRound(
    argument: _chain_JoinRoundReq,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;

  Leave(
    argument: _chain_LeaveReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  Leave(
    argument: _chain_LeaveReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  Leave(
    argument: _chain_LeaveReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  Leave(
    argument: _chain_LeaveReq,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  leave(
    argument: _chain_LeaveReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  leave(
    argument: _chain_LeaveReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  leave(
    argument: _chain_LeaveReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  leave(
    argument: _chain_LeaveReq,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;

  SelectCandidates(
    argument: _chain_CandidatesReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  SelectCandidates(
    argument: _chain_CandidatesReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  SelectCandidates(
    argument: _chain_CandidatesReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  SelectCandidates(
    argument: _chain_CandidatesReq,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  selectCandidates(
    argument: _chain_CandidatesReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  selectCandidates(
    argument: _chain_CandidatesReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  selectCandidates(
    argument: _chain_CandidatesReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  selectCandidates(
    argument: _chain_CandidatesReq,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;

  StartAggregation(
    argument: _chain_AggregationReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  StartAggregation(
    argument: _chain_AggregationReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  StartAggregation(
    argument: _chain_AggregationReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  StartAggregation(
    argument: _chain_AggregationReq,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  startAggregation(
    argument: _chain_AggregationReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  startAggregation(
    argument: _chain_AggregationReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  startAggregation(
    argument: _chain_AggregationReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  startAggregation(
    argument: _chain_AggregationReq,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;

  StartCalculation(
    argument: _chain_CalculationReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  StartCalculation(
    argument: _chain_CalculationReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  StartCalculation(
    argument: _chain_CalculationReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  StartCalculation(
    argument: _chain_CalculationReq,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  startCalculation(
    argument: _chain_CalculationReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  startCalculation(
    argument: _chain_CalculationReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  startCalculation(
    argument: _chain_CalculationReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  startCalculation(
    argument: _chain_CalculationReq,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;

  StartRound(
    argument: _chain_StartRoundReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  StartRound(
    argument: _chain_StartRoundReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  StartRound(
    argument: _chain_StartRoundReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  StartRound(
    argument: _chain_StartRoundReq,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  startRound(
    argument: _chain_StartRoundReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  startRound(
    argument: _chain_StartRoundReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  startRound(
    argument: _chain_StartRoundReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  startRound(
    argument: _chain_StartRoundReq,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;

  Subscribe(
    argument: _chain_EventReq,
    metadata: grpc.Metadata,
    options?: grpc.CallOptions
  ): grpc.ClientReadableStream<_chain_Event__Output>;
  Subscribe(
    argument: _chain_EventReq,
    options?: grpc.CallOptions
  ): grpc.ClientReadableStream<_chain_Event__Output>;
  subscribe(
    argument: _chain_EventReq,
    metadata: grpc.Metadata,
    options?: grpc.CallOptions
  ): grpc.ClientReadableStream<_chain_Event__Output>;
  subscribe(
    argument: _chain_EventReq,
    options?: grpc.CallOptions
  ): grpc.ClientReadableStream<_chain_Event__Output>;

  UpdateName(
    argument: _chain_UpdateNameReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  UpdateName(
    argument: _chain_UpdateNameReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  UpdateName(
    argument: _chain_UpdateNameReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  UpdateName(
    argument: _chain_UpdateNameReq,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  updateName(
    argument: _chain_UpdateNameReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  updateName(
    argument: _chain_UpdateNameReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  updateName(
    argument: _chain_UpdateNameReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  updateName(
    argument: _chain_UpdateNameReq,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;

  UpdateUrl(
    argument: _chain_UpdateUrlReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  UpdateUrl(
    argument: _chain_UpdateUrlReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  UpdateUrl(
    argument: _chain_UpdateUrlReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  UpdateUrl(
    argument: _chain_UpdateUrlReq,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  updateUrl(
    argument: _chain_UpdateUrlReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  updateUrl(
    argument: _chain_UpdateUrlReq,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  updateUrl(
    argument: _chain_UpdateUrlReq,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  updateUrl(
    argument: _chain_UpdateUrlReq,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;

  UploadResultCommitment(
    argument: _chain_ResultCommitment,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  UploadResultCommitment(
    argument: _chain_ResultCommitment,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  UploadResultCommitment(
    argument: _chain_ResultCommitment,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  UploadResultCommitment(
    argument: _chain_ResultCommitment,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  uploadResultCommitment(
    argument: _chain_ResultCommitment,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  uploadResultCommitment(
    argument: _chain_ResultCommitment,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  uploadResultCommitment(
    argument: _chain_ResultCommitment,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  uploadResultCommitment(
    argument: _chain_ResultCommitment,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;

  UploadSecretKey(
    argument: _chain_Share,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  UploadSecretKey(
    argument: _chain_Share,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  UploadSecretKey(
    argument: _chain_Share,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  UploadSecretKey(
    argument: _chain_Share,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  uploadSecretKey(
    argument: _chain_Share,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  uploadSecretKey(
    argument: _chain_Share,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  uploadSecretKey(
    argument: _chain_Share,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  uploadSecretKey(
    argument: _chain_Share,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;

  UploadSecretKeyCommitment(
    argument: _chain_ShareCommitment,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  UploadSecretKeyCommitment(
    argument: _chain_ShareCommitment,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  UploadSecretKeyCommitment(
    argument: _chain_ShareCommitment,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  UploadSecretKeyCommitment(
    argument: _chain_ShareCommitment,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  uploadSecretKeyCommitment(
    argument: _chain_ShareCommitment,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  uploadSecretKeyCommitment(
    argument: _chain_ShareCommitment,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  uploadSecretKeyCommitment(
    argument: _chain_ShareCommitment,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  uploadSecretKeyCommitment(
    argument: _chain_ShareCommitment,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;

  UploadSeed(
    argument: _chain_Share,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  UploadSeed(
    argument: _chain_Share,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  UploadSeed(
    argument: _chain_Share,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  UploadSeed(
    argument: _chain_Share,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  uploadSeed(
    argument: _chain_Share,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  uploadSeed(
    argument: _chain_Share,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  uploadSeed(
    argument: _chain_Share,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  uploadSeed(
    argument: _chain_Share,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;

  UploadSeedCommitment(
    argument: _chain_ShareCommitment,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  UploadSeedCommitment(
    argument: _chain_ShareCommitment,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  UploadSeedCommitment(
    argument: _chain_ShareCommitment,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  UploadSeedCommitment(
    argument: _chain_ShareCommitment,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  uploadSeedCommitment(
    argument: _chain_ShareCommitment,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  uploadSeedCommitment(
    argument: _chain_ShareCommitment,
    metadata: grpc.Metadata,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  uploadSeedCommitment(
    argument: _chain_ShareCommitment,
    options: grpc.CallOptions,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
  uploadSeedCommitment(
    argument: _chain_ShareCommitment,
    callback: (error?: grpc.ServiceError, result?: _chain_Transaction__Output) => void
  ): grpc.ClientUnaryCall;
}

export interface ChainHandlers extends grpc.UntypedServiceImplementation {
  CreateTask: grpc.handleUnaryCall<_chain_CreateTaskReq__Output, _chain_CreateTaskResp>;

  EndRound: grpc.handleUnaryCall<_chain_EndRoundReq__Output, _chain_Transaction>;

  FinishTask: grpc.handleUnaryCall<_chain_FinishTaskReq__Output, _chain_Transaction>;

  GetClientPublickKeys: grpc.handleUnaryCall<_chain_PublicKeyReq__Output, _chain_PublicKeyResp>;

  GetNodeInfo: grpc.handleUnaryCall<_chain_NodeInfoReq__Output, _chain_NodeInfo>;

  GetNodes: grpc.handleUnaryCall<_chain_NodeInfosReq__Output, _chain_NodeInfos>;

  GetResultCommitment: grpc.handleUnaryCall<_chain_ResultCommitmentReq__Output, _chain_ResultCommitmentResp>;

  GetSecretShareDatas: grpc.handleUnaryCall<_chain_SecretShareReq__Output, _chain_SecretShareResp>;

  GetTask: grpc.handleUnaryCall<_chain_TaskReq__Output, _chain_TaskResp>;

  GetTaskRound: grpc.handleUnaryCall<_chain_TaskRoundReq__Output, _chain_TaskRoundResp>;

  Join: grpc.handleUnaryCall<_chain_JoinReq__Output, _chain_JoinResp>;

  JoinRound: grpc.handleUnaryCall<_chain_JoinRoundReq__Output, _chain_Transaction>;

  Leave: grpc.handleUnaryCall<_chain_LeaveReq__Output, _chain_Transaction>;

  SelectCandidates: grpc.handleUnaryCall<_chain_CandidatesReq__Output, _chain_Transaction>;

  StartAggregation: grpc.handleUnaryCall<_chain_AggregationReq__Output, _chain_Transaction>;

  StartCalculation: grpc.handleUnaryCall<_chain_CalculationReq__Output, _chain_Transaction>;

  StartRound: grpc.handleUnaryCall<_chain_StartRoundReq__Output, _chain_Transaction>;

  Subscribe: grpc.handleServerStreamingCall<_chain_EventReq__Output, _chain_Event>;

  UpdateName: grpc.handleUnaryCall<_chain_UpdateNameReq__Output, _chain_Transaction>;

  UpdateUrl: grpc.handleUnaryCall<_chain_UpdateUrlReq__Output, _chain_Transaction>;

  UploadResultCommitment: grpc.handleUnaryCall<_chain_ResultCommitment__Output, _chain_Transaction>;

  UploadSecretKey: grpc.handleUnaryCall<_chain_Share__Output, _chain_Transaction>;

  UploadSecretKeyCommitment: grpc.handleUnaryCall<_chain_ShareCommitment__Output, _chain_Transaction>;

  UploadSeed: grpc.handleUnaryCall<_chain_Share__Output, _chain_Transaction>;

  UploadSeedCommitment: grpc.handleUnaryCall<_chain_ShareCommitment__Output, _chain_Transaction>;
}

export interface ChainDefinition extends grpc.ServiceDefinition {
  CreateTask: MethodDefinition<
    _chain_CreateTaskReq,
    _chain_CreateTaskResp,
    _chain_CreateTaskReq__Output,
    _chain_CreateTaskResp__Output
  >;
  EndRound: MethodDefinition<
    _chain_EndRoundReq,
    _chain_Transaction,
    _chain_EndRoundReq__Output,
    _chain_Transaction__Output
  >;
  FinishTask: MethodDefinition<
    _chain_FinishTaskReq,
    _chain_Transaction,
    _chain_FinishTaskReq__Output,
    _chain_Transaction__Output
  >;
  GetClientPublickKeys: MethodDefinition<
    _chain_PublicKeyReq,
    _chain_PublicKeyResp,
    _chain_PublicKeyReq__Output,
    _chain_PublicKeyResp__Output
  >;
  GetNodeInfo: MethodDefinition<
    _chain_NodeInfoReq,
    _chain_NodeInfo,
    _chain_NodeInfoReq__Output,
    _chain_NodeInfo__Output
  >;
  GetNodes: MethodDefinition<
    _chain_NodeInfosReq,
    _chain_NodeInfos,
    _chain_NodeInfosReq__Output,
    _chain_NodeInfos__Output
  >;
  GetResultCommitment: MethodDefinition<
    _chain_ResultCommitmentReq,
    _chain_ResultCommitmentResp,
    _chain_ResultCommitmentReq__Output,
    _chain_ResultCommitmentResp__Output
  >;
  GetSecretShareDatas: MethodDefinition<
    _chain_SecretShareReq,
    _chain_SecretShareResp,
    _chain_SecretShareReq__Output,
    _chain_SecretShareResp__Output
  >;
  GetTask: MethodDefinition<_chain_TaskReq, _chain_TaskResp, _chain_TaskReq__Output, _chain_TaskResp__Output>;
  GetTaskRound: MethodDefinition<
    _chain_TaskRoundReq,
    _chain_TaskRoundResp,
    _chain_TaskRoundReq__Output,
    _chain_TaskRoundResp__Output
  >;
  Join: MethodDefinition<_chain_JoinReq, _chain_JoinResp, _chain_JoinReq__Output, _chain_JoinResp__Output>;
  JoinRound: MethodDefinition<
    _chain_JoinRoundReq,
    _chain_Transaction,
    _chain_JoinRoundReq__Output,
    _chain_Transaction__Output
  >;
  Leave: MethodDefinition<
    _chain_LeaveReq,
    _chain_Transaction,
    _chain_LeaveReq__Output,
    _chain_Transaction__Output
  >;
  SelectCandidates: MethodDefinition<
    _chain_CandidatesReq,
    _chain_Transaction,
    _chain_CandidatesReq__Output,
    _chain_Transaction__Output
  >;
  StartAggregation: MethodDefinition<
    _chain_AggregationReq,
    _chain_Transaction,
    _chain_AggregationReq__Output,
    _chain_Transaction__Output
  >;
  StartCalculation: MethodDefinition<
    _chain_CalculationReq,
    _chain_Transaction,
    _chain_CalculationReq__Output,
    _chain_Transaction__Output
  >;
  StartRound: MethodDefinition<
    _chain_StartRoundReq,
    _chain_Transaction,
    _chain_StartRoundReq__Output,
    _chain_Transaction__Output
  >;
  Subscribe: MethodDefinition<_chain_EventReq, _chain_Event, _chain_EventReq__Output, _chain_Event__Output>;
  UpdateName: MethodDefinition<
    _chain_UpdateNameReq,
    _chain_Transaction,
    _chain_UpdateNameReq__Output,
    _chain_Transaction__Output
  >;
  UpdateUrl: MethodDefinition<
    _chain_UpdateUrlReq,
    _chain_Transaction,
    _chain_UpdateUrlReq__Output,
    _chain_Transaction__Output
  >;
  UploadResultCommitment: MethodDefinition<
    _chain_ResultCommitment,
    _chain_Transaction,
    _chain_ResultCommitment__Output,
    _chain_Transaction__Output
  >;
  UploadSecretKey: MethodDefinition<
    _chain_Share,
    _chain_Transaction,
    _chain_Share__Output,
    _chain_Transaction__Output
  >;
  UploadSecretKeyCommitment: MethodDefinition<
    _chain_ShareCommitment,
    _chain_Transaction,
    _chain_ShareCommitment__Output,
    _chain_Transaction__Output
  >;
  UploadSeed: MethodDefinition<
    _chain_Share,
    _chain_Transaction,
    _chain_Share__Output,
    _chain_Transaction__Output
  >;
  UploadSeedCommitment: MethodDefinition<
    _chain_ShareCommitment,
    _chain_Transaction,
    _chain_ShareCommitment__Output,
    _chain_Transaction__Output
  >;
}
