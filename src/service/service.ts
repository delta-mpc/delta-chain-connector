import * as grpc from "@grpc/grpc-js";
import { Event as ImplEvent, impl } from "src/impl";
import log from "src/log";
import { AggregationReq__Output } from "./chain/AggregationReq";
import { CalculationReq__Output } from "./chain/CalculationReq";
import { CandidatesReq__Output } from "./chain/CandidatesReq";
import { ChainHandlers } from "./chain/Chain";
import { CreateTaskReq__Output } from "./chain/CreateTaskReq";
import { CreateTaskResp } from "./chain/CreateTaskResp";
import { Empty } from "./chain/Empty";
import { EndRoundReq__Output } from "./chain/EndRoundReq";
import { Event } from "./chain/Event";
import { EventReq__Output } from "./chain/EventReq";
import { JoinReq__Output } from "./chain/JoinReq";
import { JoinResp } from "./chain/JoinResp";
import { JoinRoundReq__Output } from "./chain/JoinRoundReq";
import { LeaveReq__Output } from "./chain/LeaveReq";
import { NodeInfoReq__Output } from "./chain/NodeInfoReq";
import { NodeInfoResp } from "./chain/NodeInfoResp";
import { PublicKeyReq__Output } from "./chain/PublicKeyReq";
import { PublicKeyResp } from "./chain/PublicKeyResp";
import { ResultCommitment__Output } from "./chain/ResultCommitment";
import { ResultCommitmentReq__Output } from "./chain/ResultCommitmentReq";
import { ResultCommitmentResp } from "./chain/ResultCommitmentResp";
import { SecretShareReq__Output } from "./chain/SecretShareReq";
import { SecretShareResp } from "./chain/SecretShareResp";
import { Share__Output } from "./chain/Share";
import { ShareCommitment__Output } from "./chain/ShareCommitment";
import { StartRoundReq__Output } from "./chain/StartRoundReq";
import { TaskRoundReq__Output } from "./chain/TaskRoundReq";
import { TaskRoundResp } from "./chain/TaskRoundResp";
import { UpdateNameReq__Output } from "./chain/UpdateNameReq";
import { UpdateUrlReq__Output } from "./chain/UpdateUrlReq";

export const chainService: ChainHandlers = {
  Join(call: grpc.ServerUnaryCall<JoinReq__Output, JoinResp>, callback: grpc.sendUnaryData<JoinResp>) {
    const url = call.request.url;
    const name = call.request.name;

    impl
      .join(url, name)
      .then((address) => {
        log.info(`node ${address} join in`);
        callback(null, { address: address });
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  UpdateName(call: grpc.ServerUnaryCall<UpdateNameReq__Output, Empty>, callback: grpc.sendUnaryData<Empty>) {
    const address = call.request.address;
    const name = call.request.name;

    impl
      .updateName(address, name)
      .then(() => {
        log.info(`node ${address} change name to ${name}`);
        callback(null, {});
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  UpdateUrl(call: grpc.ServerUnaryCall<UpdateUrlReq__Output, Empty>, callback: grpc.sendUnaryData<Empty>) {
    const address = call.request.address;
    const url = call.request.url;

    impl
      .updateUrl(address, url)
      .then(() => {
        log.info(`node ${address} change url to ${url}`);
        callback(null, {});
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  Leave(call: grpc.ServerUnaryCall<LeaveReq__Output, Empty>, callback: grpc.sendUnaryData<Empty>) {
    const address = call.request.address;

    impl
      .leave(address)
      .then(() => {
        log.info(`node ${address} leave`);
        callback(null, {});
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  GetNodeInfo(
    call: grpc.ServerUnaryCall<NodeInfoReq__Output, NodeInfoResp>,
    callback: grpc.sendUnaryData<NodeInfoResp>
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

  CreateTask(
    call: grpc.ServerUnaryCall<CreateTaskReq__Output, CreateTaskResp>,
    callback: grpc.sendUnaryData<CreateTaskResp>
  ) {
    impl
      .createTask(call.request.address, call.request.dataset, call.request.commitment)
      .then((taskID) => {
        log.info(`node ${call.request.address} create task ${taskID}`);
        callback(null, { taskId: taskID });
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  StartRound(call: grpc.ServerUnaryCall<StartRoundReq__Output, Empty>, callback: grpc.sendUnaryData<Empty>) {
    impl
      .startRound(call.request.address, call.request.taskId, call.request.round)
      .then(() => {
        log.info(`task ${call.request.taskId} start round ${call.request.round}`);
        callback(null, {});
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  JoinRound(call: grpc.ServerUnaryCall<JoinRoundReq__Output, Empty>, callback: grpc.sendUnaryData<Empty>) {
    impl
      .joinRound(
        call.request.address,
        call.request.taskId,
        call.request.round,
        call.request.pk1,
        call.request.pk2
      )
      .then(() => {
        log.info(`node ${call.request.address} join task ${call.request.taskId} round ${call.request.round}`);
        callback(null, {});
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
    call: grpc.ServerUnaryCall<CandidatesReq__Output, Empty>,
    callback: grpc.sendUnaryData<Empty>
  ) {
    impl
      .selectCandidates(call.request.address, call.request.taskId, call.request.round, call.request.clients)
      .then(() => {
        log.info(`task ${call.request.taskId} round ${call.request.round} select candidates`);
        callback(null, {});
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  UploadSeedCommitment(
    call: grpc.ServerUnaryCall<ShareCommitment__Output, Empty>,
    callback: grpc.sendUnaryData<Empty>
  ) {
    impl
      .uploadSeedCommitment(
        call.request.address,
        call.request.taskId,
        call.request.round,
        call.request.receiver,
        call.request.commitment
      )
      .then(() => {
        log.info(`task ${call.request.taskId} round ${call.request.round} seed commitment 
        ${call.request.address} -> ${call.request.receiver}`);
        callback(null, {});
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  UploadSecretKeyCommitment(
    call: grpc.ServerUnaryCall<ShareCommitment__Output, Empty>,
    callback: grpc.sendUnaryData<Empty>
  ) {
    impl
      .uploadSecretKeyCommitment(
        call.request.address,
        call.request.taskId,
        call.request.round,
        call.request.receiver,
        call.request.commitment
      )
      .then(() => {
        log.info(`task ${call.request.taskId} round ${call.request.round} secret key commitment 
        ${call.request.address} -> ${call.request.receiver}`);
        callback(null, {});
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
      .getClientPublickKeys(call.request.taskId, call.request.round, call.request.client)
      .then(([pk1, pk2]) => {
        log.info(`node ${call.request.taskId} task ${call.request.taskId} round ${call.request.round}
        pk1 ${pk1} pk2 ${pk2}`);
        callback(null, { pk1: pk1, pk2: pk2 });
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  StartCalculation(
    call: grpc.ServerUnaryCall<CalculationReq__Output, Empty>,
    callback: grpc.sendUnaryData<Empty>
  ) {
    impl
      .startCalculation(call.request.address, call.request.taskId, call.request.round, call.request.clients)
      .then(() => {
        log.info(`task ${call.request.taskId} round ${call.request.round} start calculation`);
        callback(null, {});
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  UploadResultCommitment(
    call: grpc.ServerUnaryCall<ResultCommitment__Output, Empty>,
    callback: grpc.sendUnaryData<Empty>
  ) {
    impl
      .uploadResultCommitment(
        call.request.address,
        call.request.taskId,
        call.request.round,
        call.request.commitment
      )
      .then(() => {
        log.info(`node ${call.request.address} task ${call.request} round ${call.request.round}
        upload result commitment`);
        callback(null, {});
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
    call: grpc.ServerUnaryCall<AggregationReq__Output, Empty>,
    callback: grpc.sendUnaryData<Empty>
  ) {
    impl
      .startAggregation(call.request.address, call.request.taskId, call.request.round, call.request.clients)
      .then(() => {
        log.info(`task ${call.request.taskId} round ${call.request.round} start aggregation`);
        callback(null, {});
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  UploadSeed(call: grpc.ServerUnaryCall<Share__Output, Empty>, callback: grpc.sendUnaryData<Empty>) {
    impl
      .uploadSeed(
        call.request.address,
        call.request.taskId,
        call.request.round,
        call.request.sender,
        call.request.share
      )
      .then(() => {
        log.info(`task ${call.request.taskId} round ${call.request.round} seed
        ${call.request.sender} -> ${call.request.address}`);
        callback(null, {});
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  UploadSecretKey(call: grpc.ServerUnaryCall<Share__Output, Empty>, callback: grpc.sendUnaryData<Empty>) {
    impl
      .uploadSecretKey(
        call.request.address,
        call.request.taskId,
        call.request.round,
        call.request.sender,
        call.request.share
      )
      .then(() => {
        log.info(`task ${call.request.taskId} round ${call.request.round} secret key
        ${call.request.sender} -> ${call.request.address}`);
        callback(null, {});
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  GetSecretShareData(
    call: grpc.ServerUnaryCall<SecretShareReq__Output, SecretShareResp>,
    callback: grpc.sendUnaryData<SecretShareResp>
  ) {
    impl
      .getSecretShareData(call.request.taskId, call.request.round, call.request.sender, call.request.receiver)
      .then((data) => {
        log.info(`get task ${call.request.taskId} round ${call.request.round}
        ${call.request.sender} -> ${call.request.receiver} secret share data`);
        callback(null, data);
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  EndRound(call: grpc.ServerUnaryCall<EndRoundReq__Output, Empty>, callback: grpc.sendUnaryData<Empty>) {
    impl
      .endRound(call.request.address, call.request.taskId, call.request.round)
      .then(() => {
        log.info(`task ${call.request.taskId} round ${call.request.round} end`);
        callback(null, {});
      })
      .catch((err: Error) => {
        log.error(err);
        callback(err, null);
      });
  },

  Subscribe(call: grpc.ServerWritableStream<EventReq__Output, Event>) {
    const address = call.request.address;
    log.info(`node ${address} subscribe`);
    const stream = impl.subscribe();
    stream.on("data", (event: ImplEvent) => {
      switch (event.type) {
        case "TaskCreated":
          call.write({
            taskCreate: {
              address: event.address,
              url: event.url,
              taskId: event.taskID,
              dataset: event.dataset,
              commitment: event.commitment,
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
