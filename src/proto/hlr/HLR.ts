// Original file: src/proto/hlr.proto

import type * as grpc from "@grpc/grpc-js";
import type { MethodDefinition } from "@grpc/proto-loader";
import type {
  AggregationReq as _hlr_AggregationReq,
  AggregationReq__Output as _hlr_AggregationReq__Output,
} from "../hlr/AggregationReq";
import type {
  CalculationReq as _hlr_CalculationReq,
  CalculationReq__Output as _hlr_CalculationReq__Output,
} from "../hlr/CalculationReq";
import type {
  CandidatesReq as _hlr_CandidatesReq,
  CandidatesReq__Output as _hlr_CandidatesReq__Output,
} from "../hlr/CandidatesReq";
import type {
  ConfirmReq as _hlr_ConfirmReq,
  ConfirmReq__Output as _hlr_ConfirmReq__Output,
} from "../hlr/ConfirmReq";
import type {
  CreateTaskReq as _hlr_CreateTaskReq,
  CreateTaskReq__Output as _hlr_CreateTaskReq__Output,
} from "../hlr/CreateTaskReq";
import type {
  CreateTaskResp as _hlr_CreateTaskResp,
  CreateTaskResp__Output as _hlr_CreateTaskResp__Output,
} from "../hlr/CreateTaskResp";
import type {
  EndRoundReq as _hlr_EndRoundReq,
  EndRoundReq__Output as _hlr_EndRoundReq__Output,
} from "../hlr/EndRoundReq";
import type {
  FinishTaskReq as _hlr_FinishTaskReq,
  FinishTaskReq__Output as _hlr_FinishTaskReq__Output,
} from "../hlr/FinishTaskReq";
import type {
  JoinRoundReq as _hlr_JoinRoundReq,
  JoinRoundReq__Output as _hlr_JoinRoundReq__Output,
} from "../hlr/JoinRoundReq";
import type {
  PublicKeyReq as _hlr_PublicKeyReq,
  PublicKeyReq__Output as _hlr_PublicKeyReq__Output,
} from "../hlr/PublicKeyReq";
import type {
  PublicKeyResp as _hlr_PublicKeyResp,
  PublicKeyResp__Output as _hlr_PublicKeyResp__Output,
} from "../hlr/PublicKeyResp";
import type {
  ResultCommitment as _hlr_ResultCommitment,
  ResultCommitment__Output as _hlr_ResultCommitment__Output,
} from "../hlr/ResultCommitment";
import type {
  ResultCommitmentReq as _hlr_ResultCommitmentReq,
  ResultCommitmentReq__Output as _hlr_ResultCommitmentReq__Output,
} from "../hlr/ResultCommitmentReq";
import type {
  ResultCommitmentResp as _hlr_ResultCommitmentResp,
  ResultCommitmentResp__Output as _hlr_ResultCommitmentResp__Output,
} from "../hlr/ResultCommitmentResp";
import type {
  SecretShareReq as _hlr_SecretShareReq,
  SecretShareReq__Output as _hlr_SecretShareReq__Output,
} from "../hlr/SecretShareReq";
import type {
  SecretShareResp as _hlr_SecretShareResp,
  SecretShareResp__Output as _hlr_SecretShareResp__Output,
} from "../hlr/SecretShareResp";
import type { Share as _hlr_Share, Share__Output as _hlr_Share__Output } from "../hlr/Share";
import type {
  ShareCommitment as _hlr_ShareCommitment,
  ShareCommitment__Output as _hlr_ShareCommitment__Output,
} from "../hlr/ShareCommitment";
import type {
  StartRoundReq as _hlr_StartRoundReq,
  StartRoundReq__Output as _hlr_StartRoundReq__Output,
} from "../hlr/StartRoundReq";
import type { TaskReq as _hlr_TaskReq, TaskReq__Output as _hlr_TaskReq__Output } from "../hlr/TaskReq";
import type { TaskResp as _hlr_TaskResp, TaskResp__Output as _hlr_TaskResp__Output } from "../hlr/TaskResp";
import type {
  TaskRoundReq as _hlr_TaskRoundReq,
  TaskRoundReq__Output as _hlr_TaskRoundReq__Output,
} from "../hlr/TaskRoundReq";
import type {
  TaskRoundResp as _hlr_TaskRoundResp,
  TaskRoundResp__Output as _hlr_TaskRoundResp__Output,
} from "../hlr/TaskRoundResp";
import type {
  Transaction as _transaction_Transaction,
  Transaction__Output as _transaction_Transaction__Output,
} from "../transaction/Transaction";
import type {
  VerifyReq as _hlr_VerifyReq,
  VerifyReq__Output as _hlr_VerifyReq__Output,
} from "../hlr/VerifyReq";
import type {
  VerifyResp as _hlr_VerifyResp,
  VerifyResp__Output as _hlr_VerifyResp__Output,
} from "../hlr/VerifyResp";
import type {
  VerifyState as _hlr_VerifyState,
  VerifyState__Output as _hlr_VerifyState__Output,
} from "../hlr/VerifyState";
import type {
  WeightCommitmentReq as _hlr_WeightCommitmentReq,
  WeightCommitmentReq__Output as _hlr_WeightCommitmentReq__Output,
} from "../hlr/WeightCommitmentReq";
import type {
  WeightCommitmentResp as _hlr_WeightCommitmentResp,
  WeightCommitmentResp__Output as _hlr_WeightCommitmentResp__Output,
} from "../hlr/WeightCommitmentResp";

export interface HLRClient extends grpc.Client {
  ConfirmVerification(
    argument: _hlr_ConfirmReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  ConfirmVerification(
    argument: _hlr_ConfirmReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  ConfirmVerification(
    argument: _hlr_ConfirmReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  ConfirmVerification(
    argument: _hlr_ConfirmReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  confirmVerification(
    argument: _hlr_ConfirmReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  confirmVerification(
    argument: _hlr_ConfirmReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  confirmVerification(
    argument: _hlr_ConfirmReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  confirmVerification(
    argument: _hlr_ConfirmReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;

  CreateTask(
    argument: _hlr_CreateTaskReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_CreateTaskResp__Output>
  ): grpc.ClientUnaryCall;
  CreateTask(
    argument: _hlr_CreateTaskReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_hlr_CreateTaskResp__Output>
  ): grpc.ClientUnaryCall;
  CreateTask(
    argument: _hlr_CreateTaskReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_CreateTaskResp__Output>
  ): grpc.ClientUnaryCall;
  CreateTask(
    argument: _hlr_CreateTaskReq,
    callback: grpc.requestCallback<_hlr_CreateTaskResp__Output>
  ): grpc.ClientUnaryCall;
  createTask(
    argument: _hlr_CreateTaskReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_CreateTaskResp__Output>
  ): grpc.ClientUnaryCall;
  createTask(
    argument: _hlr_CreateTaskReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_hlr_CreateTaskResp__Output>
  ): grpc.ClientUnaryCall;
  createTask(
    argument: _hlr_CreateTaskReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_CreateTaskResp__Output>
  ): grpc.ClientUnaryCall;
  createTask(
    argument: _hlr_CreateTaskReq,
    callback: grpc.requestCallback<_hlr_CreateTaskResp__Output>
  ): grpc.ClientUnaryCall;

  EndRound(
    argument: _hlr_EndRoundReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  EndRound(
    argument: _hlr_EndRoundReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  EndRound(
    argument: _hlr_EndRoundReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  EndRound(
    argument: _hlr_EndRoundReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  endRound(
    argument: _hlr_EndRoundReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  endRound(
    argument: _hlr_EndRoundReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  endRound(
    argument: _hlr_EndRoundReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  endRound(
    argument: _hlr_EndRoundReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;

  FinishTask(
    argument: _hlr_FinishTaskReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  FinishTask(
    argument: _hlr_FinishTaskReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  FinishTask(
    argument: _hlr_FinishTaskReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  FinishTask(
    argument: _hlr_FinishTaskReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  finishTask(
    argument: _hlr_FinishTaskReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  finishTask(
    argument: _hlr_FinishTaskReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  finishTask(
    argument: _hlr_FinishTaskReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  finishTask(
    argument: _hlr_FinishTaskReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;

  GetClientPublickKeys(
    argument: _hlr_PublicKeyReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_PublicKeyResp__Output>
  ): grpc.ClientUnaryCall;
  GetClientPublickKeys(
    argument: _hlr_PublicKeyReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_hlr_PublicKeyResp__Output>
  ): grpc.ClientUnaryCall;
  GetClientPublickKeys(
    argument: _hlr_PublicKeyReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_PublicKeyResp__Output>
  ): grpc.ClientUnaryCall;
  GetClientPublickKeys(
    argument: _hlr_PublicKeyReq,
    callback: grpc.requestCallback<_hlr_PublicKeyResp__Output>
  ): grpc.ClientUnaryCall;
  getClientPublickKeys(
    argument: _hlr_PublicKeyReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_PublicKeyResp__Output>
  ): grpc.ClientUnaryCall;
  getClientPublickKeys(
    argument: _hlr_PublicKeyReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_hlr_PublicKeyResp__Output>
  ): grpc.ClientUnaryCall;
  getClientPublickKeys(
    argument: _hlr_PublicKeyReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_PublicKeyResp__Output>
  ): grpc.ClientUnaryCall;
  getClientPublickKeys(
    argument: _hlr_PublicKeyReq,
    callback: grpc.requestCallback<_hlr_PublicKeyResp__Output>
  ): grpc.ClientUnaryCall;

  GetResultCommitment(
    argument: _hlr_ResultCommitmentReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_ResultCommitmentResp__Output>
  ): grpc.ClientUnaryCall;
  GetResultCommitment(
    argument: _hlr_ResultCommitmentReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_hlr_ResultCommitmentResp__Output>
  ): grpc.ClientUnaryCall;
  GetResultCommitment(
    argument: _hlr_ResultCommitmentReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_ResultCommitmentResp__Output>
  ): grpc.ClientUnaryCall;
  GetResultCommitment(
    argument: _hlr_ResultCommitmentReq,
    callback: grpc.requestCallback<_hlr_ResultCommitmentResp__Output>
  ): grpc.ClientUnaryCall;
  getResultCommitment(
    argument: _hlr_ResultCommitmentReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_ResultCommitmentResp__Output>
  ): grpc.ClientUnaryCall;
  getResultCommitment(
    argument: _hlr_ResultCommitmentReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_hlr_ResultCommitmentResp__Output>
  ): grpc.ClientUnaryCall;
  getResultCommitment(
    argument: _hlr_ResultCommitmentReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_ResultCommitmentResp__Output>
  ): grpc.ClientUnaryCall;
  getResultCommitment(
    argument: _hlr_ResultCommitmentReq,
    callback: grpc.requestCallback<_hlr_ResultCommitmentResp__Output>
  ): grpc.ClientUnaryCall;

  GetSecretShareDatas(
    argument: _hlr_SecretShareReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_SecretShareResp__Output>
  ): grpc.ClientUnaryCall;
  GetSecretShareDatas(
    argument: _hlr_SecretShareReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_hlr_SecretShareResp__Output>
  ): grpc.ClientUnaryCall;
  GetSecretShareDatas(
    argument: _hlr_SecretShareReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_SecretShareResp__Output>
  ): grpc.ClientUnaryCall;
  GetSecretShareDatas(
    argument: _hlr_SecretShareReq,
    callback: grpc.requestCallback<_hlr_SecretShareResp__Output>
  ): grpc.ClientUnaryCall;
  getSecretShareDatas(
    argument: _hlr_SecretShareReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_SecretShareResp__Output>
  ): grpc.ClientUnaryCall;
  getSecretShareDatas(
    argument: _hlr_SecretShareReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_hlr_SecretShareResp__Output>
  ): grpc.ClientUnaryCall;
  getSecretShareDatas(
    argument: _hlr_SecretShareReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_SecretShareResp__Output>
  ): grpc.ClientUnaryCall;
  getSecretShareDatas(
    argument: _hlr_SecretShareReq,
    callback: grpc.requestCallback<_hlr_SecretShareResp__Output>
  ): grpc.ClientUnaryCall;

  GetTask(
    argument: _hlr_TaskReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_TaskResp__Output>
  ): grpc.ClientUnaryCall;
  GetTask(
    argument: _hlr_TaskReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_hlr_TaskResp__Output>
  ): grpc.ClientUnaryCall;
  GetTask(
    argument: _hlr_TaskReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_TaskResp__Output>
  ): grpc.ClientUnaryCall;
  GetTask(
    argument: _hlr_TaskReq,
    callback: grpc.requestCallback<_hlr_TaskResp__Output>
  ): grpc.ClientUnaryCall;
  getTask(
    argument: _hlr_TaskReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_TaskResp__Output>
  ): grpc.ClientUnaryCall;
  getTask(
    argument: _hlr_TaskReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_hlr_TaskResp__Output>
  ): grpc.ClientUnaryCall;
  getTask(
    argument: _hlr_TaskReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_TaskResp__Output>
  ): grpc.ClientUnaryCall;
  getTask(
    argument: _hlr_TaskReq,
    callback: grpc.requestCallback<_hlr_TaskResp__Output>
  ): grpc.ClientUnaryCall;

  GetTaskRound(
    argument: _hlr_TaskRoundReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_TaskRoundResp__Output>
  ): grpc.ClientUnaryCall;
  GetTaskRound(
    argument: _hlr_TaskRoundReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_hlr_TaskRoundResp__Output>
  ): grpc.ClientUnaryCall;
  GetTaskRound(
    argument: _hlr_TaskRoundReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_TaskRoundResp__Output>
  ): grpc.ClientUnaryCall;
  GetTaskRound(
    argument: _hlr_TaskRoundReq,
    callback: grpc.requestCallback<_hlr_TaskRoundResp__Output>
  ): grpc.ClientUnaryCall;
  getTaskRound(
    argument: _hlr_TaskRoundReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_TaskRoundResp__Output>
  ): grpc.ClientUnaryCall;
  getTaskRound(
    argument: _hlr_TaskRoundReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_hlr_TaskRoundResp__Output>
  ): grpc.ClientUnaryCall;
  getTaskRound(
    argument: _hlr_TaskRoundReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_TaskRoundResp__Output>
  ): grpc.ClientUnaryCall;
  getTaskRound(
    argument: _hlr_TaskRoundReq,
    callback: grpc.requestCallback<_hlr_TaskRoundResp__Output>
  ): grpc.ClientUnaryCall;

  GetVerifierState(
    argument: _hlr_TaskReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_VerifyState__Output>
  ): grpc.ClientUnaryCall;
  GetVerifierState(
    argument: _hlr_TaskReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_hlr_VerifyState__Output>
  ): grpc.ClientUnaryCall;
  GetVerifierState(
    argument: _hlr_TaskReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_VerifyState__Output>
  ): grpc.ClientUnaryCall;
  GetVerifierState(
    argument: _hlr_TaskReq,
    callback: grpc.requestCallback<_hlr_VerifyState__Output>
  ): grpc.ClientUnaryCall;
  getVerifierState(
    argument: _hlr_TaskReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_VerifyState__Output>
  ): grpc.ClientUnaryCall;
  getVerifierState(
    argument: _hlr_TaskReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_hlr_VerifyState__Output>
  ): grpc.ClientUnaryCall;
  getVerifierState(
    argument: _hlr_TaskReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_VerifyState__Output>
  ): grpc.ClientUnaryCall;
  getVerifierState(
    argument: _hlr_TaskReq,
    callback: grpc.requestCallback<_hlr_VerifyState__Output>
  ): grpc.ClientUnaryCall;

  GetWeightCommitment(
    argument: _hlr_WeightCommitmentReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_WeightCommitmentResp__Output>
  ): grpc.ClientUnaryCall;
  GetWeightCommitment(
    argument: _hlr_WeightCommitmentReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_hlr_WeightCommitmentResp__Output>
  ): grpc.ClientUnaryCall;
  GetWeightCommitment(
    argument: _hlr_WeightCommitmentReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_WeightCommitmentResp__Output>
  ): grpc.ClientUnaryCall;
  GetWeightCommitment(
    argument: _hlr_WeightCommitmentReq,
    callback: grpc.requestCallback<_hlr_WeightCommitmentResp__Output>
  ): grpc.ClientUnaryCall;
  getWeightCommitment(
    argument: _hlr_WeightCommitmentReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_WeightCommitmentResp__Output>
  ): grpc.ClientUnaryCall;
  getWeightCommitment(
    argument: _hlr_WeightCommitmentReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_hlr_WeightCommitmentResp__Output>
  ): grpc.ClientUnaryCall;
  getWeightCommitment(
    argument: _hlr_WeightCommitmentReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_WeightCommitmentResp__Output>
  ): grpc.ClientUnaryCall;
  getWeightCommitment(
    argument: _hlr_WeightCommitmentReq,
    callback: grpc.requestCallback<_hlr_WeightCommitmentResp__Output>
  ): grpc.ClientUnaryCall;

  JoinRound(
    argument: _hlr_JoinRoundReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  JoinRound(
    argument: _hlr_JoinRoundReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  JoinRound(
    argument: _hlr_JoinRoundReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  JoinRound(
    argument: _hlr_JoinRoundReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  joinRound(
    argument: _hlr_JoinRoundReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  joinRound(
    argument: _hlr_JoinRoundReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  joinRound(
    argument: _hlr_JoinRoundReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  joinRound(
    argument: _hlr_JoinRoundReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;

  SelectCandidates(
    argument: _hlr_CandidatesReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  SelectCandidates(
    argument: _hlr_CandidatesReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  SelectCandidates(
    argument: _hlr_CandidatesReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  SelectCandidates(
    argument: _hlr_CandidatesReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  selectCandidates(
    argument: _hlr_CandidatesReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  selectCandidates(
    argument: _hlr_CandidatesReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  selectCandidates(
    argument: _hlr_CandidatesReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  selectCandidates(
    argument: _hlr_CandidatesReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;

  StartAggregation(
    argument: _hlr_AggregationReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  StartAggregation(
    argument: _hlr_AggregationReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  StartAggregation(
    argument: _hlr_AggregationReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  StartAggregation(
    argument: _hlr_AggregationReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  startAggregation(
    argument: _hlr_AggregationReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  startAggregation(
    argument: _hlr_AggregationReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  startAggregation(
    argument: _hlr_AggregationReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  startAggregation(
    argument: _hlr_AggregationReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;

  StartCalculation(
    argument: _hlr_CalculationReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  StartCalculation(
    argument: _hlr_CalculationReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  StartCalculation(
    argument: _hlr_CalculationReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  StartCalculation(
    argument: _hlr_CalculationReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  startCalculation(
    argument: _hlr_CalculationReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  startCalculation(
    argument: _hlr_CalculationReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  startCalculation(
    argument: _hlr_CalculationReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  startCalculation(
    argument: _hlr_CalculationReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;

  StartRound(
    argument: _hlr_StartRoundReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  StartRound(
    argument: _hlr_StartRoundReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  StartRound(
    argument: _hlr_StartRoundReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  StartRound(
    argument: _hlr_StartRoundReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  startRound(
    argument: _hlr_StartRoundReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  startRound(
    argument: _hlr_StartRoundReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  startRound(
    argument: _hlr_StartRoundReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  startRound(
    argument: _hlr_StartRoundReq,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;

  UploadResultCommitment(
    argument: _hlr_ResultCommitment,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  UploadResultCommitment(
    argument: _hlr_ResultCommitment,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  UploadResultCommitment(
    argument: _hlr_ResultCommitment,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  UploadResultCommitment(
    argument: _hlr_ResultCommitment,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadResultCommitment(
    argument: _hlr_ResultCommitment,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadResultCommitment(
    argument: _hlr_ResultCommitment,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadResultCommitment(
    argument: _hlr_ResultCommitment,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadResultCommitment(
    argument: _hlr_ResultCommitment,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;

  UploadSecretKey(
    argument: _hlr_Share,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  UploadSecretKey(
    argument: _hlr_Share,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  UploadSecretKey(
    argument: _hlr_Share,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  UploadSecretKey(
    argument: _hlr_Share,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSecretKey(
    argument: _hlr_Share,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSecretKey(
    argument: _hlr_Share,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSecretKey(
    argument: _hlr_Share,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSecretKey(
    argument: _hlr_Share,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;

  UploadSecretKeyCommitment(
    argument: _hlr_ShareCommitment,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  UploadSecretKeyCommitment(
    argument: _hlr_ShareCommitment,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  UploadSecretKeyCommitment(
    argument: _hlr_ShareCommitment,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  UploadSecretKeyCommitment(
    argument: _hlr_ShareCommitment,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSecretKeyCommitment(
    argument: _hlr_ShareCommitment,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSecretKeyCommitment(
    argument: _hlr_ShareCommitment,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSecretKeyCommitment(
    argument: _hlr_ShareCommitment,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSecretKeyCommitment(
    argument: _hlr_ShareCommitment,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;

  UploadSeed(
    argument: _hlr_Share,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  UploadSeed(
    argument: _hlr_Share,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  UploadSeed(
    argument: _hlr_Share,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  UploadSeed(
    argument: _hlr_Share,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSeed(
    argument: _hlr_Share,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSeed(
    argument: _hlr_Share,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSeed(
    argument: _hlr_Share,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSeed(
    argument: _hlr_Share,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;

  UploadSeedCommitment(
    argument: _hlr_ShareCommitment,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  UploadSeedCommitment(
    argument: _hlr_ShareCommitment,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  UploadSeedCommitment(
    argument: _hlr_ShareCommitment,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  UploadSeedCommitment(
    argument: _hlr_ShareCommitment,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSeedCommitment(
    argument: _hlr_ShareCommitment,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSeedCommitment(
    argument: _hlr_ShareCommitment,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSeedCommitment(
    argument: _hlr_ShareCommitment,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;
  uploadSeedCommitment(
    argument: _hlr_ShareCommitment,
    callback: grpc.requestCallback<_transaction_Transaction__Output>
  ): grpc.ClientUnaryCall;

  Verify(
    argument: _hlr_VerifyReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_VerifyResp__Output>
  ): grpc.ClientUnaryCall;
  Verify(
    argument: _hlr_VerifyReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_hlr_VerifyResp__Output>
  ): grpc.ClientUnaryCall;
  Verify(
    argument: _hlr_VerifyReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_VerifyResp__Output>
  ): grpc.ClientUnaryCall;
  Verify(
    argument: _hlr_VerifyReq,
    callback: grpc.requestCallback<_hlr_VerifyResp__Output>
  ): grpc.ClientUnaryCall;
  verify(
    argument: _hlr_VerifyReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_VerifyResp__Output>
  ): grpc.ClientUnaryCall;
  verify(
    argument: _hlr_VerifyReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_hlr_VerifyResp__Output>
  ): grpc.ClientUnaryCall;
  verify(
    argument: _hlr_VerifyReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_hlr_VerifyResp__Output>
  ): grpc.ClientUnaryCall;
  verify(
    argument: _hlr_VerifyReq,
    callback: grpc.requestCallback<_hlr_VerifyResp__Output>
  ): grpc.ClientUnaryCall;
}

export interface HLRHandlers extends grpc.UntypedServiceImplementation {
  ConfirmVerification: grpc.handleUnaryCall<_hlr_ConfirmReq__Output, _transaction_Transaction>;

  CreateTask: grpc.handleUnaryCall<_hlr_CreateTaskReq__Output, _hlr_CreateTaskResp>;

  EndRound: grpc.handleUnaryCall<_hlr_EndRoundReq__Output, _transaction_Transaction>;

  FinishTask: grpc.handleUnaryCall<_hlr_FinishTaskReq__Output, _transaction_Transaction>;

  GetClientPublickKeys: grpc.handleUnaryCall<_hlr_PublicKeyReq__Output, _hlr_PublicKeyResp>;

  GetResultCommitment: grpc.handleUnaryCall<_hlr_ResultCommitmentReq__Output, _hlr_ResultCommitmentResp>;

  GetSecretShareDatas: grpc.handleUnaryCall<_hlr_SecretShareReq__Output, _hlr_SecretShareResp>;

  GetTask: grpc.handleUnaryCall<_hlr_TaskReq__Output, _hlr_TaskResp>;

  GetTaskRound: grpc.handleUnaryCall<_hlr_TaskRoundReq__Output, _hlr_TaskRoundResp>;

  GetVerifierState: grpc.handleUnaryCall<_hlr_TaskReq__Output, _hlr_VerifyState>;

  GetWeightCommitment: grpc.handleUnaryCall<_hlr_WeightCommitmentReq__Output, _hlr_WeightCommitmentResp>;

  JoinRound: grpc.handleUnaryCall<_hlr_JoinRoundReq__Output, _transaction_Transaction>;

  SelectCandidates: grpc.handleUnaryCall<_hlr_CandidatesReq__Output, _transaction_Transaction>;

  StartAggregation: grpc.handleUnaryCall<_hlr_AggregationReq__Output, _transaction_Transaction>;

  StartCalculation: grpc.handleUnaryCall<_hlr_CalculationReq__Output, _transaction_Transaction>;

  StartRound: grpc.handleUnaryCall<_hlr_StartRoundReq__Output, _transaction_Transaction>;

  UploadResultCommitment: grpc.handleUnaryCall<_hlr_ResultCommitment__Output, _transaction_Transaction>;

  UploadSecretKey: grpc.handleUnaryCall<_hlr_Share__Output, _transaction_Transaction>;

  UploadSecretKeyCommitment: grpc.handleUnaryCall<_hlr_ShareCommitment__Output, _transaction_Transaction>;

  UploadSeed: grpc.handleUnaryCall<_hlr_Share__Output, _transaction_Transaction>;

  UploadSeedCommitment: grpc.handleUnaryCall<_hlr_ShareCommitment__Output, _transaction_Transaction>;

  Verify: grpc.handleUnaryCall<_hlr_VerifyReq__Output, _hlr_VerifyResp>;
}

export interface HLRDefinition extends grpc.ServiceDefinition {
  ConfirmVerification: MethodDefinition<
    _hlr_ConfirmReq,
    _transaction_Transaction,
    _hlr_ConfirmReq__Output,
    _transaction_Transaction__Output
  >;
  CreateTask: MethodDefinition<
    _hlr_CreateTaskReq,
    _hlr_CreateTaskResp,
    _hlr_CreateTaskReq__Output,
    _hlr_CreateTaskResp__Output
  >;
  EndRound: MethodDefinition<
    _hlr_EndRoundReq,
    _transaction_Transaction,
    _hlr_EndRoundReq__Output,
    _transaction_Transaction__Output
  >;
  FinishTask: MethodDefinition<
    _hlr_FinishTaskReq,
    _transaction_Transaction,
    _hlr_FinishTaskReq__Output,
    _transaction_Transaction__Output
  >;
  GetClientPublickKeys: MethodDefinition<
    _hlr_PublicKeyReq,
    _hlr_PublicKeyResp,
    _hlr_PublicKeyReq__Output,
    _hlr_PublicKeyResp__Output
  >;
  GetResultCommitment: MethodDefinition<
    _hlr_ResultCommitmentReq,
    _hlr_ResultCommitmentResp,
    _hlr_ResultCommitmentReq__Output,
    _hlr_ResultCommitmentResp__Output
  >;
  GetSecretShareDatas: MethodDefinition<
    _hlr_SecretShareReq,
    _hlr_SecretShareResp,
    _hlr_SecretShareReq__Output,
    _hlr_SecretShareResp__Output
  >;
  GetTask: MethodDefinition<_hlr_TaskReq, _hlr_TaskResp, _hlr_TaskReq__Output, _hlr_TaskResp__Output>;
  GetTaskRound: MethodDefinition<
    _hlr_TaskRoundReq,
    _hlr_TaskRoundResp,
    _hlr_TaskRoundReq__Output,
    _hlr_TaskRoundResp__Output
  >;
  GetVerifierState: MethodDefinition<
    _hlr_TaskReq,
    _hlr_VerifyState,
    _hlr_TaskReq__Output,
    _hlr_VerifyState__Output
  >;
  GetWeightCommitment: MethodDefinition<
    _hlr_WeightCommitmentReq,
    _hlr_WeightCommitmentResp,
    _hlr_WeightCommitmentReq__Output,
    _hlr_WeightCommitmentResp__Output
  >;
  JoinRound: MethodDefinition<
    _hlr_JoinRoundReq,
    _transaction_Transaction,
    _hlr_JoinRoundReq__Output,
    _transaction_Transaction__Output
  >;
  SelectCandidates: MethodDefinition<
    _hlr_CandidatesReq,
    _transaction_Transaction,
    _hlr_CandidatesReq__Output,
    _transaction_Transaction__Output
  >;
  StartAggregation: MethodDefinition<
    _hlr_AggregationReq,
    _transaction_Transaction,
    _hlr_AggregationReq__Output,
    _transaction_Transaction__Output
  >;
  StartCalculation: MethodDefinition<
    _hlr_CalculationReq,
    _transaction_Transaction,
    _hlr_CalculationReq__Output,
    _transaction_Transaction__Output
  >;
  StartRound: MethodDefinition<
    _hlr_StartRoundReq,
    _transaction_Transaction,
    _hlr_StartRoundReq__Output,
    _transaction_Transaction__Output
  >;
  UploadResultCommitment: MethodDefinition<
    _hlr_ResultCommitment,
    _transaction_Transaction,
    _hlr_ResultCommitment__Output,
    _transaction_Transaction__Output
  >;
  UploadSecretKey: MethodDefinition<
    _hlr_Share,
    _transaction_Transaction,
    _hlr_Share__Output,
    _transaction_Transaction__Output
  >;
  UploadSecretKeyCommitment: MethodDefinition<
    _hlr_ShareCommitment,
    _transaction_Transaction,
    _hlr_ShareCommitment__Output,
    _transaction_Transaction__Output
  >;
  UploadSeed: MethodDefinition<
    _hlr_Share,
    _transaction_Transaction,
    _hlr_Share__Output,
    _transaction_Transaction__Output
  >;
  UploadSeedCommitment: MethodDefinition<
    _hlr_ShareCommitment,
    _transaction_Transaction,
    _hlr_ShareCommitment__Output,
    _transaction_Transaction__Output
  >;
  Verify: MethodDefinition<_hlr_VerifyReq, _hlr_VerifyResp, _hlr_VerifyReq__Output, _hlr_VerifyResp__Output>;
}
