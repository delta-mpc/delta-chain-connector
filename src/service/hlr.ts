import * as grpc from "@grpc/grpc-js";
import * as protoloader from "@grpc/proto-loader";
import { getHLR } from "~/impl";
import log from "~/log";
import { ProtoGrpcType } from "~/proto/hlr";
import { AggregationReq__Output } from "~/proto/hlr/AggregationReq";
import { CalculationReq__Output } from "~/proto/hlr/CalculationReq";
import { CandidatesReq__Output } from "~/proto/hlr/CandidatesReq";
import { ConfirmReq__Output } from "~/proto/hlr/ConfirmReq";
import { CreateTaskReq__Output } from "~/proto/hlr/CreateTaskReq";
import { CreateTaskResp } from "~/proto/hlr/CreateTaskResp";
import { EndRoundReq__Output } from "~/proto/hlr/EndRoundReq";
import { FinishTaskReq__Output } from "~/proto/hlr/FinishTaskReq";
import { HLRHandlers } from "~/proto/hlr/HLR";
import { JoinRoundReq__Output } from "~/proto/hlr/JoinRoundReq";
import { PublicKeyReq__Output } from "~/proto/hlr/PublicKeyReq";
import { PublicKeyResp } from "~/proto/hlr/PublicKeyResp";
import { ResultCommitment__Output } from "~/proto/hlr/ResultCommitment";
import { ResultCommitmentReq__Output } from "~/proto/hlr/ResultCommitmentReq";
import { ResultCommitmentResp } from "~/proto/hlr/ResultCommitmentResp";
import { SecretShareReq__Output } from "~/proto/hlr/SecretShareReq";
import { SecretShareResp } from "~/proto/hlr/SecretShareResp";
import { Share__Output } from "~/proto/hlr/Share";
import { ShareCommitment__Output } from "~/proto/hlr/ShareCommitment";
import { StartRoundReq__Output } from "~/proto/hlr/StartRoundReq";
import { TaskReq__Output } from "~/proto/hlr/TaskReq";
import { TaskResp } from "~/proto/hlr/TaskResp";
import { TaskRoundReq__Output } from "~/proto/hlr/TaskRoundReq";
import { TaskRoundResp } from "~/proto/hlr/TaskRoundResp";
import { VerifyReq__Output } from "~/proto/hlr/VerifyReq";
import { VerifyResp } from "~/proto/hlr/VerifyResp";
import { VerifyState } from "~/proto/hlr/VerifyState";
import { WeightCommitmentReq__Output } from "~/proto/hlr/WeightCommitmentReq";
import { WeightCommitmentResp } from "~/proto/hlr/WeightCommitmentResp";
import { Transaction } from "~/proto/transaction/Transaction";

const service: HLRHandlers = {
  CreateTask(
    call: grpc.ServerUnaryCall<CreateTaskReq__Output, CreateTaskResp>,
    callback: grpc.sendUnaryData<CreateTaskResp>
  ) {
    getHLR()
      .createTask(
        call.request.address,
        call.request.dataset,
        call.request.commitment,
        call.request.enableVerify,
        call.request.tolerance
      )
      .then(([txHash, taskID]) => {
        log.info(`node ${call.request.address} create task ${taskID}`);
        callback(null, { txHash: txHash, taskId: taskID });
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  FinishTask(
    call: grpc.ServerUnaryCall<FinishTaskReq__Output, Transaction>,
    callback: grpc.sendUnaryData<Transaction>
  ) {
    getHLR()
      .finishTask(call.request.address, call.request.taskId)
      .then((txHash) => {
        log.info(`task ${call.request.taskId} finish task`);
        callback(null, { txHash: txHash });
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  GetTask(call: grpc.ServerUnaryCall<TaskReq__Output, TaskResp>, callback: grpc.sendUnaryData<TaskResp>) {
    getHLR()
      .getTask(call.request.taskId)
      .then((taskInfo) => {
        log.info(`get task ${call.request.taskId} info`);
        callback(null, taskInfo);
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  StartRound(
    call: grpc.ServerUnaryCall<StartRoundReq__Output, Transaction>,
    callback: grpc.sendUnaryData<Transaction>
  ) {
    getHLR()
      .startRound(
        call.request.address,
        call.request.taskId,
        call.request.round,
        call.request.weightCommitment
      )
      .then((txHash) => {
        log.info(`task ${call.request.taskId} start round ${call.request.round}`);
        callback(null, { txHash: txHash });
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  GetWeightCommitment(
    call: grpc.ServerUnaryCall<WeightCommitmentReq__Output, WeightCommitmentResp>,
    callback: grpc.sendUnaryData<WeightCommitmentResp>
  ) {
    getHLR()
      .getWeightCommitment(call.request.taskId, call.request.round)
      .then((commitment) => {
        log.info(`get task ${call.request.taskId} round ${call.request.round} weight commitment`);
        callback(null, { commitment: commitment });
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  JoinRound(
    call: grpc.ServerUnaryCall<JoinRoundReq__Output, Transaction>,
    callback: grpc.sendUnaryData<Transaction>
  ) {
    getHLR()
      .joinRound(
        call.request.address,
        call.request.taskId,
        call.request.round,
        call.request.pk1,
        call.request.pk2
      )
      .then((txHash) => {
        log.info(`node ${call.request.address} join task ${call.request.taskId} round ${call.request.round}`);
        callback(null, { txHash: txHash });
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  GetTaskRound(
    call: grpc.ServerUnaryCall<TaskRoundReq__Output, TaskRoundResp>,
    callback: grpc.sendUnaryData<TaskRoundResp>
  ) {
    getHLR()
      .getTaskRound(call.request.taskId, call.request.round)
      .then((info) => {
        log.info(`get task ${call.request.taskId} round ${call.request.round} info`);
        callback(null, info);
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  SelectCandidates(
    call: grpc.ServerUnaryCall<CandidatesReq__Output, Transaction>,
    callback: grpc.sendUnaryData<Transaction>
  ) {
    getHLR()
      .selectCandidates(call.request.address, call.request.taskId, call.request.round, call.request.clients)
      .then((txHash) => {
        log.info(`task ${call.request.taskId} round ${call.request.round} select candidates`);
        callback(null, { txHash: txHash });
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  UploadSeedCommitment(
    call: grpc.ServerUnaryCall<ShareCommitment__Output, Transaction>,
    callback: grpc.sendUnaryData<Transaction>
  ) {
    getHLR()
      .uploadSeedCommitment(
        call.request.address,
        call.request.taskId,
        call.request.round,
        call.request.receivers,
        call.request.commitments
      )
      .then((txHash) => {
        log.info(`task ${call.request.taskId} round ${call.request.round} seed commitment 
        ${call.request.address} -> ${call.request.receivers}`);
        callback(null, { txHash: txHash });
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  UploadSecretKeyCommitment(
    call: grpc.ServerUnaryCall<ShareCommitment__Output, Transaction>,
    callback: grpc.sendUnaryData<Transaction>
  ) {
    getHLR()
      .uploadSecretKeyCommitment(
        call.request.address,
        call.request.taskId,
        call.request.round,
        call.request.receivers,
        call.request.commitments
      )
      .then((txHash) => {
        log.info(`task ${call.request.taskId} round ${call.request.round} secret key commitment 
        ${call.request.address} -> ${call.request.receivers}`);
        callback(null, { txHash: txHash });
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  GetClientPublickKeys(
    call: grpc.ServerUnaryCall<PublicKeyReq__Output, PublicKeyResp>,
    callback: grpc.sendUnaryData<PublicKeyResp>
  ) {
    getHLR()
      .getClientPublicKeys(call.request.taskId, call.request.round, call.request.clients)
      .then((pks) => {
        log.info(
          `task ${call.request.taskId} round ${call.request.round} clients ${call.request.clients} pks`
        );
        const keys = pks.map((item) => {
          return {
            pk1: item[0],
            pk2: item[1],
          };
        });
        callback(null, { keys: keys });
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  StartCalculation(
    call: grpc.ServerUnaryCall<CalculationReq__Output, Transaction>,
    callback: grpc.sendUnaryData<Transaction>
  ) {
    getHLR()
      .startCalculation(call.request.address, call.request.taskId, call.request.round, call.request.clients)
      .then((txHash) => {
        log.info(`task ${call.request.taskId} round ${call.request.round} start calculation`);
        callback(null, { txHash: txHash });
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  UploadResultCommitment(
    call: grpc.ServerUnaryCall<ResultCommitment__Output, Transaction>,
    callback: grpc.sendUnaryData<Transaction>
  ) {
    getHLR()
      .uploadResultCommitment(
        call.request.address,
        call.request.taskId,
        call.request.round,
        call.request.commitment
      )
      .then((txHash) => {
        log.info(`node ${call.request.address} task ${call.request} round ${call.request.round}
        upload result commitment`);
        callback(null, { txHash: txHash });
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  GetResultCommitment(
    call: grpc.ServerUnaryCall<ResultCommitmentReq__Output, ResultCommitmentResp>,
    callback: grpc.sendUnaryData<ResultCommitmentResp>
  ) {
    getHLR()
      .getResultCommitment(call.request.taskId, call.request.round, call.request.client)
      .then((commitment) => {
        log.info(`get task ${call.request.taskId} round ${call.request.round} result commitment`);
        callback(null, { commitment: commitment });
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  StartAggregation(
    call: grpc.ServerUnaryCall<AggregationReq__Output, Transaction>,
    callback: grpc.sendUnaryData<Transaction>
  ) {
    getHLR()
      .startAggregation(call.request.address, call.request.taskId, call.request.round, call.request.clients)
      .then((txHash) => {
        log.info(`task ${call.request.taskId} round ${call.request.round} start aggregation`);
        callback(null, { txHash: txHash });
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  UploadSeed(
    call: grpc.ServerUnaryCall<Share__Output, Transaction>,
    callback: grpc.sendUnaryData<Transaction>
  ) {
    getHLR()
      .uploadSeed(
        call.request.address,
        call.request.taskId,
        call.request.round,
        call.request.senders,
        call.request.shares
      )
      .then((txHash) => {
        log.info(`task ${call.request.taskId} round ${call.request.round} seed
        ${call.request.senders} -> ${call.request.address}`);
        callback(null, { txHash: txHash });
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  UploadSecretKey(
    call: grpc.ServerUnaryCall<Share__Output, Transaction>,
    callback: grpc.sendUnaryData<Transaction>
  ) {
    getHLR()
      .uploadSecretKey(
        call.request.address,
        call.request.taskId,
        call.request.round,
        call.request.senders,
        call.request.shares
      )
      .then((txHash) => {
        log.info(`task ${call.request.taskId} round ${call.request.round} secret key
        ${call.request.senders} -> ${call.request.address}`);
        callback(null, { txHash: txHash });
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  GetSecretShareDatas(
    call: grpc.ServerUnaryCall<SecretShareReq__Output, SecretShareResp>,
    callback: grpc.sendUnaryData<SecretShareResp>
  ) {
    getHLR()
      .getSecretShareDatas(
        call.request.taskId,
        call.request.round,
        call.request.senders,
        call.request.receiver
      )
      .then((data) => {
        log.info(`get task ${call.request.taskId} round ${call.request.round}
        ${call.request.senders} -> ${call.request.receiver} secret share data`);
        callback(null, { shares: data });
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  EndRound(
    call: grpc.ServerUnaryCall<EndRoundReq__Output, Transaction>,
    callback: grpc.sendUnaryData<Transaction>
  ) {
    getHLR()
      .endRound(call.request.address, call.request.taskId, call.request.round)
      .then((txHash) => {
        log.info(`task ${call.request.taskId} round ${call.request.round} end`);
        callback(null, { txHash: txHash });
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  Verify(
    call: grpc.ServerUnaryCall<VerifyReq__Output, VerifyResp>,
    callback: grpc.sendUnaryData<VerifyResp>
  ) {
    getHLR()
      .verify(
        call.request.address,
        call.request.taskId,
        call.request.weightSize,
        call.request.proof,
        call.request.pubSignals,
        call.request.blockIndex,
        call.request.samples
      )
      .then(([txhash, valid]) => {
        log.info(`${call.request.address} task ${call.request.taskId} verify`);
        callback(null, { txHash: txhash, valid: valid });
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  GetVerifierState(
    call: grpc.ServerUnaryCall<TaskReq__Output, VerifyState>,
    callback: grpc.sendUnaryData<VerifyState>
  ) {
    getHLR()
      .getVerifierState(call.request.taskId)
      .then((state) => {
        log.info(`${call.request.taskId} get verifier state`);
        callback(null, state);
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  ConfirmVerification(
    call: grpc.ServerUnaryCall<ConfirmReq__Output, Transaction>,
    callback: grpc.sendUnaryData<Transaction>
  ) {
    getHLR()
      .confirmVerification(call.request.address, call.request.taskId)
      .then((txHash) => {
        log.info(`task ${call.request.taskId} verification confirmed`);
        callback(null, { txHash: txHash });
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  }
};

export function addService(server: grpc.Server): void {
  const definition = protoloader.loadSync(__dirname + "/../proto/hlr.proto", {
    defaults: true,
    oneofs: true,
  });
  const proto = grpc.loadPackageDefinition(definition) as unknown as ProtoGrpcType;
  server.addService(proto.hlr.HLR.service, service);
}
