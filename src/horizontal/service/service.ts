import * as grpc from "@grpc/grpc-js";
import { HeartBeatEvent } from "~/event";
import log from "~/log";
import { Event as HEvent } from "../event";
import { impl } from "../impl";
import { AggregationReq__Output } from "./horizontal/AggregationReq";
import { CalculationReq__Output } from "./horizontal/CalculationReq";
import { CandidatesReq__Output } from "./horizontal/CandidatesReq";
import { CreateTaskReq__Output } from "./horizontal/CreateTaskReq";
import { CreateTaskResp } from "./horizontal/CreateTaskResp";
import { EndRoundReq__Output } from "./horizontal/EndRoundReq";
import { Event } from "./horizontal/Event";
import { EventReq__Output } from "./horizontal/EventReq";
import { FinishTaskReq__Output } from "./horizontal/FinishTaskReq";
import { HorizontalHandlers } from "./horizontal/Horizontal";
import { JoinReq__Output } from "./horizontal/JoinReq";
import { JoinResp } from "./horizontal/JoinResp";
import { JoinRoundReq__Output } from "./horizontal/JoinRoundReq";
import { LeaveReq__Output } from "./horizontal/LeaveReq";
import { NodeInfo } from "./horizontal/NodeInfo";
import { NodeInfoReq__Output } from "./horizontal/NodeInfoReq";
import { NodeInfos } from "./horizontal/NodeInfos";
import { NodeInfosReq__Output } from "./horizontal/NodeInfosReq";
import { PublicKeyReq__Output } from "./horizontal/PublicKeyReq";
import { PublicKeyResp } from "./horizontal/PublicKeyResp";
import { ResultCommitment__Output } from "./horizontal/ResultCommitment";
import { ResultCommitmentReq__Output } from "./horizontal/ResultCommitmentReq";
import { ResultCommitmentResp } from "./horizontal/ResultCommitmentResp";
import { SecretShareReq__Output } from "./horizontal/SecretShareReq";
import { SecretShareResp } from "./horizontal/SecretShareResp";
import { Share__Output } from "./horizontal/Share";
import { ShareCommitment__Output } from "./horizontal/ShareCommitment";
import { StartRoundReq__Output } from "./horizontal/StartRoundReq";
import { TaskReq__Output } from "./horizontal/TaskReq";
import { TaskResp } from "./horizontal/TaskResp";
import { TaskRoundReq__Output } from "./horizontal/TaskRoundReq";
import { TaskRoundResp } from "./horizontal/TaskRoundResp";
import { Transaction } from "./horizontal/Transaction";
import { UpdateNameReq__Output } from "./horizontal/UpdateNameReq";
import { UpdateUrlReq__Output } from "./horizontal/UpdateUrlReq";

export const service: HorizontalHandlers = {
  Join(call: grpc.ServerUnaryCall<JoinReq__Output, JoinResp>, callback: grpc.sendUnaryData<JoinResp>) {
    const url = call.request.url;
    const name = call.request.name;

    impl
      .join(url, name)
      .then(([txHash, address]) => {
        log.info(`node ${address} join in`);
        callback(null, { address: address, txHash: txHash });
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  UpdateName(
    call: grpc.ServerUnaryCall<UpdateNameReq__Output, Transaction>,
    callback: grpc.sendUnaryData<Transaction>
  ) {
    const address = call.request.address;
    const name = call.request.name;

    impl
      .updateName(address, name)
      .then((txHash) => {
        log.info(`node ${address} change name to ${name}`);
        callback(null, { txHash: txHash });
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  UpdateUrl(
    call: grpc.ServerUnaryCall<UpdateUrlReq__Output, Transaction>,
    callback: grpc.sendUnaryData<Transaction>
  ) {
    const address = call.request.address;
    const url = call.request.url;

    impl
      .updateUrl(address, url)
      .then((txHash) => {
        log.info(`node ${address} change url to ${url}`);
        callback(null, { txHash: txHash });
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  Leave(
    call: grpc.ServerUnaryCall<LeaveReq__Output, Transaction>,
    callback: grpc.sendUnaryData<Transaction>
  ) {
    const address = call.request.address;

    impl
      .leave(address)
      .then((txHash) => {
        log.info(`node ${address} leave`);
        callback(null, { txHash: txHash });
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  GetNodeInfo(
    call: grpc.ServerUnaryCall<NodeInfoReq__Output, NodeInfo>,
    callback: grpc.sendUnaryData<NodeInfo>
  ) {
    const address = call.request.address;

    impl
      .getNodeInfo(address)
      .then((info) => {
        log.info(`get node info of ${address}`);
        callback(null, info);
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  GetNodes(
    call: grpc.ServerUnaryCall<NodeInfosReq__Output, NodeInfos>,
    callback: grpc.sendUnaryData<NodeInfos>
  ) {
    impl
      .getNodes(call.request.page, call.request.pageSize)
      .then((resp) => {
        log.info("get nodes");
        callback(null, resp);
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  CreateTask(
    call: grpc.ServerUnaryCall<CreateTaskReq__Output, CreateTaskResp>,
    callback: grpc.sendUnaryData<CreateTaskResp>
  ) {
    impl
      .createTask(call.request.address, call.request.dataset, call.request.commitment, call.request.taskType)
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
    impl
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
    impl
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
    impl
      .startRound(call.request.address, call.request.taskId, call.request.round)
      .then((txHash) => {
        log.info(`task ${call.request.taskId} start round ${call.request.round}`);
        callback(null, { txHash: txHash });
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
    impl
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
    impl
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
    impl
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
    impl
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
    impl
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
    impl
      .getClientPublickKeys(call.request.taskId, call.request.round, call.request.clients)
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
    impl
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
    impl
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
    impl
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
    impl
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
    impl
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
    impl
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
    impl
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
    impl
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

  Subscribe(call: grpc.ServerWritableStream<EventReq__Output, Event>) {
    const address = call.request.address;
    const timeout = call.request.timeout;
    log.info(`node ${address} subscribe`);
    const stream = impl.subscribe(address, timeout);
    stream.on("data", (event: HEvent | HeartBeatEvent) => {
      switch (event.type) {
        case "TaskCreated":
          call.write({
            taskCreated: {
              address: event.address,
              url: event.url,
              taskId: event.taskID,
              dataset: event.dataset,
              commitment: event.commitment,
              taskType: event.taskType,
            },
          });
          break;
        case "RoundStarted":
          call.write({
            roundStarted: {
              taskId: event.taskID,
              round: event.round,
            },
          });
          break;
        case "RoundEnded":
          call.write({
            roundEnded: {
              taskId: event.taskID,
              round: event.round,
            },
          });
          break;
        case "PartnerSelected":
          call.write({
            partnerSelected: {
              taskId: event.taskID,
              round: event.round,
              addrs: event.addrs,
            },
          });
          break;
        case "CalculationStarted":
          call.write({
            calculationStarted: {
              taskId: event.taskID,
              round: event.round,
              addrs: event.addrs,
            },
          });
          break;
        case "AggregationStarted":
          call.write({
            aggregationStarted: {
              taskId: event.taskID,
              round: event.round,
              addrs: event.addrs,
            },
          });
          break;
        case "TaskFinished":
          call.write({
            taskFinished: {
              taskId: event.taskID,
            },
          });
        case "Heartbeat":
          call.write({
            heartbeat: {},
          });
      }
    });
    call.on("error", () => {
      log.info(`node ${address} unsubscribe`);
      impl.unsubscribe(stream);
      call.end();
    });
    call.on("cancelled", () => {
      log.info(`node ${address} unsubscribe`);
      impl.unsubscribe(stream);
      call.end();
    });
  },
};
