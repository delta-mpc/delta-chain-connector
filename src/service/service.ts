import * as grpc from "@grpc/grpc-js";
import { impl } from "src/impl";
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
import { Event as ImplEvent } from "src/impl";

export const chainService: ChainHandlers = {
  Join(call: grpc.ServerUnaryCall<JoinReq__Output, JoinResp>, callback: grpc.sendUnaryData<JoinResp>) {
    const url = call.request.url;
    const name = call.request.name;

    impl
      .join(url, name)
      .then((address) => {
        callback(null, { address: address });
      })
      .catch((err: Error) => {
        callback(err, null);
      });
  },

  UpdateName(call: grpc.ServerUnaryCall<UpdateNameReq__Output, Empty>, callback: grpc.sendUnaryData<Empty>) {
    const address = call.request.address;
    const name = call.request.name;

    impl
      .updateName(address, name)
      .then(() => {
        callback(null, {});
      })
      .catch((err: Error) => {
        callback(err, null);
      });
  },

  UpdateUrl(call: grpc.ServerUnaryCall<UpdateUrlReq__Output, Empty>, callback: grpc.sendUnaryData<Empty>) {
    const address = call.request.address;
    const url = call.request.url;

    impl
      .updateUrl(address, url)
      .then(() => {
        callback(null, {});
      })
      .catch((err: Error) => {
        callback(err, null);
      });
  },

  Leave(call: grpc.ServerUnaryCall<LeaveReq__Output, Empty>, callback: grpc.sendUnaryData<Empty>) {
    const address = call.request.address;

    impl
      .leave(address)
      .then(() => {
        callback(null, {});
      })
      .catch((err: Error) => {
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
        callback(null, info);
      })
      .catch((err: Error) => {
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
        callback(null, { taskId: taskID });
      })
      .catch((err: Error) => {
        callback(err, null);
      });
  },

  StartRound(call: grpc.ServerUnaryCall<StartRoundReq__Output, Empty>, callback: grpc.sendUnaryData<Empty>) {
    impl
      .startRound(call.request.address, call.request.taskId, call.request.round)
      .then(() => {
        callback(null, {});
      })
      .catch((err: Error) => {
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
        callback(null, {});
      })
      .catch((err: Error) => {
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
        callback(null, info);
      })
      .catch((err: Error) => {
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
        callback(null, {});
      })
      .catch((err: Error) => {
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
        callback(null, {});
      })
      .catch((err: Error) => {
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
        callback(null, {});
      })
      .catch((err: Error) => {
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
        callback(null, { pk1: pk1, pk2: pk2 });
      })
      .catch((err: Error) => {
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
        callback(null, {});
      })
      .catch((err: Error) => {
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
        callback(null, {});
      })
      .catch((err: Error) => {
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
        callback(null, { commitment: commitment });
      })
      .catch((err: Error) => {
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
        callback(null, {});
      })
      .catch((err: Error) => {
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
        callback(null, {});
      })
      .catch((err: Error) => {
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
        callback(null, {});
      })
      .catch((err: Error) => {
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
        callback(null, data);
      })
      .catch((err: Error) => {
        callback(err, null);
      });
  },

  EndRound(call: grpc.ServerUnaryCall<EndRoundReq__Output, Empty>, callback: grpc.sendUnaryData<Empty>) {
    impl
      .endRound(call.request.address, call.request.taskId, call.request.round)
      .then(() => {
        callback(null, {});
      })
      .catch((err: Error) => {
        callback(err, null);
      });
  },

  Subscribe(call: grpc.ServerWritableStream<EventReq__Output, Event>) {
    const stream = impl.subscribe();
    stream.on("data", (event: ImplEvent) => {
      switch(event.type) {
        case "TaskCreated":
          call.write({taskCreate: event});
          break;
        case "RoundStarted":
          call.write({roundStarted: event});
          break;
        case "PartnerSelected":
          call.write({partnerSelected: event});
          break;
        case "CalculationStarted":
          call.write({calculationStarted: event});
          break;
        case "AggregationStarted":
          call.write({aggregationStarted: event});
          break;
      }
    });
    call.on("error", () => {
      impl.unsubscribe(stream);
      call.end();
    });
    call.on("cancelled", () => {
      impl.unsubscribe(stream);
      call.end();
    });
  },
};
