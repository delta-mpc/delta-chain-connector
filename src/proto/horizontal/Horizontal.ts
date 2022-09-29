// Original file: src/proto/horizontal.proto

import type * as grpc from "@grpc/grpc-js";
import type { MethodDefinition } from "@grpc/proto-loader";
import type {
  AggregationReq as _horizontal_AggregationReq,
  AggregationReq__Output as _horizontal_AggregationReq__Output,
} from "../horizontal/AggregationReq";
import type {
  CalculationReq as _horizontal_CalculationReq,
  CalculationReq__Output as _horizontal_CalculationReq__Output,
} from "../horizontal/CalculationReq";
import type {
  CandidatesReq as _horizontal_CandidatesReq,
  CandidatesReq__Output as _horizontal_CandidatesReq__Output,
} from "../horizontal/CandidatesReq";
import type {
  CreateTaskReq as _horizontal_CreateTaskReq,
  CreateTaskReq__Output as _horizontal_CreateTaskReq__Output,
} from "../horizontal/CreateTaskReq";
import type {
  CreateTaskResp as _horizontal_CreateTaskResp,
  CreateTaskResp__Output as _horizontal_CreateTaskResp__Output,
} from "../horizontal/CreateTaskResp";
import type {
  EndRoundReq as _horizontal_EndRoundReq,
  EndRoundReq__Output as _horizontal_EndRoundReq__Output,
} from "../horizontal/EndRoundReq";
import type {
  FinishTaskReq as _horizontal_FinishTaskReq,
  FinishTaskReq__Output as _horizontal_FinishTaskReq__Output,
} from "../horizontal/FinishTaskReq";
import type {
  JoinRoundReq as _horizontal_JoinRoundReq,
  JoinRoundReq__Output as _horizontal_JoinRoundReq__Output,
} from "../horizontal/JoinRoundReq";
import type {
  PublicKeyReq as _horizontal_PublicKeyReq,
  PublicKeyReq__Output as _horizontal_PublicKeyReq__Output,
} from "../horizontal/PublicKeyReq";
import type {
  PublicKeyResp as _horizontal_PublicKeyResp,
  PublicKeyResp__Output as _horizontal_PublicKeyResp__Output,
} from "../horizontal/PublicKeyResp";
import type {
  ResultCommitment as _horizontal_ResultCommitment,
  ResultCommitment__Output as _horizontal_ResultCommitment__Output,
} from "../horizontal/ResultCommitment";
import type {
  ResultCommitmentReq as _horizontal_ResultCommitmentReq,
  ResultCommitmentReq__Output as _horizontal_ResultCommitmentReq__Output,
} from "../horizontal/ResultCommitmentReq";
import type {
  ResultCommitmentResp as _horizontal_ResultCommitmentResp,
  ResultCommitmentResp__Output as _horizontal_ResultCommitmentResp__Output,
} from "../horizontal/ResultCommitmentResp";
import type {
  SecretShareReq as _horizontal_SecretShareReq,
  SecretShareReq__Output as _horizontal_SecretShareReq__Output,
} from "../horizontal/SecretShareReq";
import type {
  SecretShareResp as _horizontal_SecretShareResp,
  SecretShareResp__Output as _horizontal_SecretShareResp__Output,
} from "../horizontal/SecretShareResp";
import type {
  Share as _horizontal_Share,
  Share__Output as _horizontal_Share__Output,
} from "../horizontal/Share";
import type {
  ShareCommitment as _horizontal_ShareCommitment,
  ShareCommitment__Output as _horizontal_ShareCommitment__Output,
} from "../horizontal/ShareCommitment";
import type {
  StartRoundReq as _horizontal_StartRoundReq,
  StartRoundReq__Output as _horizontal_StartRoundReq__Output,
} from "../horizontal/StartRoundReq";
import type {
  TaskReq as _horizontal_TaskReq,
  TaskReq__Output as _horizontal_TaskReq__Output,
} from "../horizontal/TaskReq";
import type {
  TaskResp as _horizontal_TaskResp,
  TaskResp__Output as _horizontal_TaskResp__Output,
} from "../horizontal/TaskResp";
import type {
  TaskRoundReq as _horizontal_TaskRoundReq,
  TaskRoundReq__Output as _horizontal_TaskRoundReq__Output,
} from "../horizontal/TaskRoundReq";
import type {
  TaskRoundResp as _horizontal_TaskRoundResp,
  TaskRoundResp__Output as _horizontal_TaskRoundResp__Output,
} from "../horizontal/TaskRoundResp";
import type {
  Transaction as _transaction_Transaction,
  Transaction__Output as _transaction_Transaction__Output,
} from "../transaction/Transaction";

export interface HorizontalClient extends grpc.Client {
  CreateTask(
    argument: _horizontal_CreateTaskReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_horizontal_CreateTaskResp__Output>
  ): grpc.ClientUnaryCall;
  CreateTask(
    argument: _horizontal_CreateTaskReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_horizontal_CreateTaskResp__Output>
  ): grpc.ClientUnaryCall;
  CreateTask(
    argument: _horizontal_CreateTaskReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_horizontal_CreateTaskResp__Output>
  ): grpc.ClientUnaryCall;
  CreateTask(
    argument: _horizontal_CreateTaskReq,
    callback: grpc.requestCallback<_horizontal_CreateTaskResp__Output>
  ): grpc.ClientUnaryCall;
  createTask(
    argument: _horizontal_CreateTaskReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_horizontal_CreateTaskResp__Output>
  ): grpc.ClientUnaryCall;
  createTask(
    argument: _horizontal_CreateTaskReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_horizontal_CreateTaskResp__Output>
  ): grpc.ClientUnaryCall;
  createTask(
    argument: _horizontal_CreateTaskReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_horizontal_CreateTaskResp__Output>
  ): grpc.ClientUnaryCall;
  createTask(
    argument: _horizontal_CreateTaskReq,
    callback: grpc.requestCallback<_horizontal_CreateTaskResp__Output>
  ): grpc.ClientUnaryCall;

  EndRound(
    argument: _horizontal_EndRoundReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  EndRound(
    argument: _horizontal_EndRoundReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  EndRound(
    argument: _horizontal_EndRoundReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  EndRound(
    argument: _horizontal_EndRoundReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  endRound(
    argument: _horizontal_EndRoundReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  endRound(
    argument: _horizontal_EndRoundReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  endRound(
    argument: _horizontal_EndRoundReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  endRound(
    argument: _horizontal_EndRoundReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;

  FinishTask(
    argument: _horizontal_FinishTaskReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  FinishTask(
    argument: _horizontal_FinishTaskReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  FinishTask(
    argument: _horizontal_FinishTaskReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  FinishTask(
    argument: _horizontal_FinishTaskReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  finishTask(
    argument: _horizontal_FinishTaskReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  finishTask(
    argument: _horizontal_FinishTaskReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  finishTask(
    argument: _horizontal_FinishTaskReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  finishTask(
    argument: _horizontal_FinishTaskReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;

  GetClientPublickKeys(
    argument: _horizontal_PublicKeyReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_horizontal_PublicKeyResp__Output>
  ): grpc.ClientUnaryCall;
  GetClientPublickKeys(
    argument: _horizontal_PublicKeyReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_horizontal_PublicKeyResp__Output>
  ): grpc.ClientUnaryCall;
  GetClientPublickKeys(
    argument: _horizontal_PublicKeyReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_horizontal_PublicKeyResp__Output>
  ): grpc.ClientUnaryCall;
  GetClientPublickKeys(
    argument: _horizontal_PublicKeyReq,
    callback: grpc.requestCallback<_horizontal_PublicKeyResp__Output>
  ): grpc.ClientUnaryCall;
  getClientPublickKeys(
    argument: _horizontal_PublicKeyReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_horizontal_PublicKeyResp__Output>
  ): grpc.ClientUnaryCall;
  getClientPublickKeys(
    argument: _horizontal_PublicKeyReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_horizontal_PublicKeyResp__Output>
  ): grpc.ClientUnaryCall;
  getClientPublickKeys(
    argument: _horizontal_PublicKeyReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_horizontal_PublicKeyResp__Output>
  ): grpc.ClientUnaryCall;
  getClientPublickKeys(
    argument: _horizontal_PublicKeyReq,
    callback: grpc.requestCallback<_horizontal_PublicKeyResp__Output>
  ): grpc.ClientUnaryCall;

  GetResultCommitment(
    argument: _horizontal_ResultCommitmentReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_horizontal_ResultCommitmentResp__Output>
  ): grpc.ClientUnaryCall;
  GetResultCommitment(
    argument: _horizontal_ResultCommitmentReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_horizontal_ResultCommitmentResp__Output>
  ): grpc.ClientUnaryCall;
  GetResultCommitment(
    argument: _horizontal_ResultCommitmentReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_horizontal_ResultCommitmentResp__Output>
  ): grpc.ClientUnaryCall;
  GetResultCommitment(
    argument: _horizontal_ResultCommitmentReq,
    callback: grpc.requestCallback<_horizontal_ResultCommitmentResp__Output>
  ): grpc.ClientUnaryCall;
  getResultCommitment(
    argument: _horizontal_ResultCommitmentReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_horizontal_ResultCommitmentResp__Output>
  ): grpc.ClientUnaryCall;
  getResultCommitment(
    argument: _horizontal_ResultCommitmentReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_horizontal_ResultCommitmentResp__Output>
  ): grpc.ClientUnaryCall;
  getResultCommitment(
    argument: _horizontal_ResultCommitmentReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_horizontal_ResultCommitmentResp__Output>
  ): grpc.ClientUnaryCall;
  getResultCommitment(
    argument: _horizontal_ResultCommitmentReq,
    callback: grpc.requestCallback<_horizontal_ResultCommitmentResp__Output>
  ): grpc.ClientUnaryCall;

  GetSecretShareDatas(
    argument: _horizontal_SecretShareReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_horizontal_SecretShareResp__Output>
  ): grpc.ClientUnaryCall;
  GetSecretShareDatas(
    argument: _horizontal_SecretShareReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_horizontal_SecretShareResp__Output>
  ): grpc.ClientUnaryCall;
  GetSecretShareDatas(
    argument: _horizontal_SecretShareReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_horizontal_SecretShareResp__Output>
  ): grpc.ClientUnaryCall;
  GetSecretShareDatas(
    argument: _horizontal_SecretShareReq,
    callback: grpc.requestCallback<_horizontal_SecretShareResp__Output>
  ): grpc.ClientUnaryCall;
  getSecretShareDatas(
    argument: _horizontal_SecretShareReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_horizontal_SecretShareResp__Output>
  ): grpc.ClientUnaryCall;
  getSecretShareDatas(
    argument: _horizontal_SecretShareReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_horizontal_SecretShareResp__Output>
  ): grpc.ClientUnaryCall;
  getSecretShareDatas(
    argument: _horizontal_SecretShareReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_horizontal_SecretShareResp__Output>
  ): grpc.ClientUnaryCall;
  getSecretShareDatas(
    argument: _horizontal_SecretShareReq,
    callback: grpc.requestCallback<_horizontal_SecretShareResp__Output>
  ): grpc.ClientUnaryCall;

  GetTask(
    argument: _horizontal_TaskReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_horizontal_TaskResp__Output>
  ): grpc.ClientUnaryCall;
  GetTask(
    argument: _horizontal_TaskReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_horizontal_TaskResp__Output>
  ): grpc.ClientUnaryCall;
  GetTask(
    argument: _horizontal_TaskReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_horizontal_TaskResp__Output>
  ): grpc.ClientUnaryCall;
  GetTask(
    argument: _horizontal_TaskReq,
    callback: grpc.requestCallback<_horizontal_TaskResp__Output>
  ): grpc.ClientUnaryCall;
  getTask(
    argument: _horizontal_TaskReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_horizontal_TaskResp__Output>
  ): grpc.ClientUnaryCall;
  getTask(
    argument: _horizontal_TaskReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_horizontal_TaskResp__Output>
  ): grpc.ClientUnaryCall;
  getTask(
    argument: _horizontal_TaskReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_horizontal_TaskResp__Output>
  ): grpc.ClientUnaryCall;
  getTask(
    argument: _horizontal_TaskReq,
    callback: grpc.requestCallback<_horizontal_TaskResp__Output>
  ): grpc.ClientUnaryCall;

  GetTaskRound(
    argument: _horizontal_TaskRoundReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_horizontal_TaskRoundResp__Output>
  ): grpc.ClientUnaryCall;
  GetTaskRound(
    argument: _horizontal_TaskRoundReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_horizontal_TaskRoundResp__Output>
  ): grpc.ClientUnaryCall;
  GetTaskRound(
    argument: _horizontal_TaskRoundReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_horizontal_TaskRoundResp__Output>
  ): grpc.ClientUnaryCall;
  GetTaskRound(
    argument: _horizontal_TaskRoundReq,
    callback: grpc.requestCallback<_horizontal_TaskRoundResp__Output>
  ): grpc.ClientUnaryCall;
  getTaskRound(
    argument: _horizontal_TaskRoundReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_horizontal_TaskRoundResp__Output>
  ): grpc.ClientUnaryCall;
  getTaskRound(
    argument: _horizontal_TaskRoundReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_horizontal_TaskRoundResp__Output>
  ): grpc.ClientUnaryCall;
  getTaskRound(
    argument: _horizontal_TaskRoundReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_horizontal_TaskRoundResp__Output>
  ): grpc.ClientUnaryCall;
  getTaskRound(
    argument: _horizontal_TaskRoundReq,
    callback: grpc.requestCallback<_horizontal_TaskRoundResp__Output>
  ): grpc.ClientUnaryCall;

  JoinRound(
    argument: _horizontal_JoinRoundReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  JoinRound(
    argument: _horizontal_JoinRoundReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  JoinRound(
    argument: _horizontal_JoinRoundReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  JoinRound(
    argument: _horizontal_JoinRoundReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  joinRound(
    argument: _horizontal_JoinRoundReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  joinRound(
    argument: _horizontal_JoinRoundReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  joinRound(
    argument: _horizontal_JoinRoundReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  joinRound(
    argument: _horizontal_JoinRoundReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;

  SelectCandidates(
    argument: _horizontal_CandidatesReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  SelectCandidates(
    argument: _horizontal_CandidatesReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  SelectCandidates(
    argument: _horizontal_CandidatesReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  SelectCandidates(
    argument: _horizontal_CandidatesReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  selectCandidates(
    argument: _horizontal_CandidatesReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  selectCandidates(
    argument: _horizontal_CandidatesReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  selectCandidates(
    argument: _horizontal_CandidatesReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  selectCandidates(
    argument: _horizontal_CandidatesReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;

  StartAggregation(
    argument: _horizontal_AggregationReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  StartAggregation(
    argument: _horizontal_AggregationReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  StartAggregation(
    argument: _horizontal_AggregationReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  StartAggregation(
    argument: _horizontal_AggregationReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  startAggregation(
    argument: _horizontal_AggregationReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  startAggregation(
    argument: _horizontal_AggregationReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  startAggregation(
    argument: _horizontal_AggregationReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  startAggregation(
    argument: _horizontal_AggregationReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;

  StartCalculation(
    argument: _horizontal_CalculationReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  StartCalculation(
    argument: _horizontal_CalculationReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  StartCalculation(
    argument: _horizontal_CalculationReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  StartCalculation(
    argument: _horizontal_CalculationReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  startCalculation(
    argument: _horizontal_CalculationReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  startCalculation(
    argument: _horizontal_CalculationReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  startCalculation(
    argument: _horizontal_CalculationReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  startCalculation(
    argument: _horizontal_CalculationReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;

  StartRound(
    argument: _horizontal_StartRoundReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  StartRound(
    argument: _horizontal_StartRoundReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  StartRound(
    argument: _horizontal_StartRoundReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  StartRound(
    argument: _horizontal_StartRoundReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  startRound(
    argument: _horizontal_StartRoundReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  startRound(
    argument: _horizontal_StartRoundReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  startRound(
    argument: _horizontal_StartRoundReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  startRound(
    argument: _horizontal_StartRoundReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;

  UploadResultCommitment(
    argument: _horizontal_ResultCommitment,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  UploadResultCommitment(
    argument: _horizontal_ResultCommitment,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  UploadResultCommitment(
    argument: _horizontal_ResultCommitment,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  UploadResultCommitment(
    argument: _horizontal_ResultCommitment,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadResultCommitment(
    argument: _horizontal_ResultCommitment,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadResultCommitment(
    argument: _horizontal_ResultCommitment,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadResultCommitment(
    argument: _horizontal_ResultCommitment,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadResultCommitment(
    argument: _horizontal_ResultCommitment,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;

  UploadSecretKey(
    argument: _horizontal_Share,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  UploadSecretKey(
    argument: _horizontal_Share,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  UploadSecretKey(
    argument: _horizontal_Share,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  UploadSecretKey(
    argument: _horizontal_Share,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSecretKey(
    argument: _horizontal_Share,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSecretKey(
    argument: _horizontal_Share,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSecretKey(
    argument: _horizontal_Share,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSecretKey(
    argument: _horizontal_Share,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;

  UploadSecretKeyCommitment(
    argument: _horizontal_ShareCommitment,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  UploadSecretKeyCommitment(
    argument: _horizontal_ShareCommitment,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  UploadSecretKeyCommitment(
    argument: _horizontal_ShareCommitment,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  UploadSecretKeyCommitment(
    argument: _horizontal_ShareCommitment,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSecretKeyCommitment(
    argument: _horizontal_ShareCommitment,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSecretKeyCommitment(
    argument: _horizontal_ShareCommitment,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSecretKeyCommitment(
    argument: _horizontal_ShareCommitment,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSecretKeyCommitment(
    argument: _horizontal_ShareCommitment,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;

  UploadSeed(
    argument: _horizontal_Share,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  UploadSeed(
    argument: _horizontal_Share,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  UploadSeed(
    argument: _horizontal_Share,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  UploadSeed(
    argument: _horizontal_Share,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSeed(
    argument: _horizontal_Share,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSeed(
    argument: _horizontal_Share,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSeed(
    argument: _horizontal_Share,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSeed(
    argument: _horizontal_Share,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;

  UploadSeedCommitment(
    argument: _horizontal_ShareCommitment,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  UploadSeedCommitment(
    argument: _horizontal_ShareCommitment,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  UploadSeedCommitment(
    argument: _horizontal_ShareCommitment,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  UploadSeedCommitment(
    argument: _horizontal_ShareCommitment,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSeedCommitment(
    argument: _horizontal_ShareCommitment,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSeedCommitment(
    argument: _horizontal_ShareCommitment,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSeedCommitment(
    argument: _horizontal_ShareCommitment,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSeedCommitment(
    argument: _horizontal_ShareCommitment,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
}

export interface HorizontalHandlers extends grpc.UntypedServiceImplementation {
  CreateTask: grpc.handleUnaryCall<_horizontal_CreateTaskReq__Output, _horizontal_CreateTaskResp>;

  EndRound: grpc.handleUnaryCall<_horizontal_EndRoundReq__Output, _transaction_Transaction>;

  FinishTask: grpc.handleUnaryCall<_horizontal_FinishTaskReq__Output, _transaction_Transaction>;

  GetClientPublickKeys: grpc.handleUnaryCall<_horizontal_PublicKeyReq__Output, _horizontal_PublicKeyResp>;

  GetResultCommitment: grpc.handleUnaryCall<
    _horizontal_ResultCommitmentReq__Output,
    _horizontal_ResultCommitmentResp
  >;

  GetSecretShareDatas: grpc.handleUnaryCall<_horizontal_SecretShareReq__Output, _horizontal_SecretShareResp>;

  GetTask: grpc.handleUnaryCall<_horizontal_TaskReq__Output, _horizontal_TaskResp>;

  GetTaskRound: grpc.handleUnaryCall<_horizontal_TaskRoundReq__Output, _horizontal_TaskRoundResp>;

  JoinRound: grpc.handleUnaryCall<_horizontal_JoinRoundReq__Output, _transaction_Transaction>;

  SelectCandidates: grpc.handleUnaryCall<_horizontal_CandidatesReq__Output, _transaction_Transaction>;

  StartAggregation: grpc.handleUnaryCall<_horizontal_AggregationReq__Output, _transaction_Transaction>;

  StartCalculation: grpc.handleUnaryCall<_horizontal_CalculationReq__Output, _transaction_Transaction>;

  StartRound: grpc.handleUnaryCall<_horizontal_StartRoundReq__Output, _transaction_Transaction>;

  UploadResultCommitment: grpc.handleUnaryCall<
    _horizontal_ResultCommitment__Output,
    _transaction_Transaction
  >;

  UploadSecretKey: grpc.handleUnaryCall<_horizontal_Share__Output, _transaction_Transaction>;

  UploadSecretKeyCommitment: grpc.handleUnaryCall<
    _horizontal_ShareCommitment__Output,
    _transaction_Transaction
  >;

  UploadSeed: grpc.handleUnaryCall<_horizontal_Share__Output, _transaction_Transaction>;

  UploadSeedCommitment: grpc.handleUnaryCall<_horizontal_ShareCommitment__Output, _transaction_Transaction>;
}

export interface HorizontalDefinition extends grpc.ServiceDefinition {
  CreateTask: MethodDefinition<
    _horizontal_CreateTaskReq,
    _horizontal_CreateTaskResp,
    _horizontal_CreateTaskReq__Output,
    _horizontal_CreateTaskResp__Output
  >;
  EndRound: MethodDefinition<
    _horizontal_EndRoundReq,
    _transaction_Transaction,
    _horizontal_EndRoundReq__Output,
    _transaction_Transaction__Output
  >;
  FinishTask: MethodDefinition<
    _horizontal_FinishTaskReq,
    _transaction_Transaction,
    _horizontal_FinishTaskReq__Output,
    _transaction_Transaction__Output
  >;
  GetClientPublickKeys: MethodDefinition<
    _horizontal_PublicKeyReq,
    _horizontal_PublicKeyResp,
    _horizontal_PublicKeyReq__Output,
    _horizontal_PublicKeyResp__Output
  >;
  GetResultCommitment: MethodDefinition<
    _horizontal_ResultCommitmentReq,
    _horizontal_ResultCommitmentResp,
    _horizontal_ResultCommitmentReq__Output,
    _horizontal_ResultCommitmentResp__Output
  >;
  GetSecretShareDatas: MethodDefinition<
    _horizontal_SecretShareReq,
    _horizontal_SecretShareResp,
    _horizontal_SecretShareReq__Output,
    _horizontal_SecretShareResp__Output
  >;
  GetTask: MethodDefinition<
    _horizontal_TaskReq,
    _horizontal_TaskResp,
    _horizontal_TaskReq__Output,
    _horizontal_TaskResp__Output
  >;
  GetTaskRound: MethodDefinition<
    _horizontal_TaskRoundReq,
    _horizontal_TaskRoundResp,
    _horizontal_TaskRoundReq__Output,
    _horizontal_TaskRoundResp__Output
  >;
  JoinRound: MethodDefinition<
    _horizontal_JoinRoundReq,
    _transaction_Transaction,
    _horizontal_JoinRoundReq__Output,
    _transaction_Transaction__Output
  >;
  SelectCandidates: MethodDefinition<
    _horizontal_CandidatesReq,
    _transaction_Transaction,
    _horizontal_CandidatesReq__Output,
    _transaction_Transaction__Output
  >;
  StartAggregation: MethodDefinition<
    _horizontal_AggregationReq,
    _transaction_Transaction,
    _horizontal_AggregationReq__Output,
    _transaction_Transaction__Output
  >;
  StartCalculation: MethodDefinition<
    _horizontal_CalculationReq,
    _transaction_Transaction,
    _horizontal_CalculationReq__Output,
    _transaction_Transaction__Output
  >;
  StartRound: MethodDefinition<
    _horizontal_StartRoundReq,
    _transaction_Transaction,
    _horizontal_StartRoundReq__Output,
    _transaction_Transaction__Output
  >;
  UploadResultCommitment: MethodDefinition<
    _horizontal_ResultCommitment,
    _transaction_Transaction,
    _horizontal_ResultCommitment__Output,
    _transaction_Transaction__Output
  >;
  UploadSecretKey: MethodDefinition<
    _horizontal_Share,
    _transaction_Transaction,
    _horizontal_Share__Output,
    _transaction_Transaction__Output
  >;
  UploadSecretKeyCommitment: MethodDefinition<
    _horizontal_ShareCommitment,
    _transaction_Transaction,
    _horizontal_ShareCommitment__Output,
    _transaction_Transaction__Output
  >;
  UploadSeed: MethodDefinition<
    _horizontal_Share,
    _transaction_Transaction,
    _horizontal_Share__Output,
    _transaction_Transaction__Output
  >;
  UploadSeedCommitment: MethodDefinition<
    _horizontal_ShareCommitment,
    _transaction_Transaction,
    _horizontal_ShareCommitment__Output,
    _transaction_Transaction__Output
  >;
}
