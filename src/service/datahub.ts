import * as grpc from "@grpc/grpc-js";
import * as protoloader from "@grpc/proto-loader";
import { getDataHub } from "~/impl";
import log from "~/log";
import { ProtoGrpcType } from "~/proto/datahub";
import { DataCommitmentReq__Output } from "~/proto/datahub/DataCommitmentReq";
import { DataCommitmentResp } from "~/proto/datahub/DataCommitmentResp";
import { DataHubHandlers } from "~/proto/datahub/DataHub";
import { RegisterReq__Output } from "~/proto/datahub/RegisterReq";
import { Transaction } from "~/proto/transaction/Transaction";

const service: DataHubHandlers = {
  Register(
    call: grpc.ServerUnaryCall<RegisterReq__Output, Transaction>,
    callback: grpc.sendUnaryData<Transaction>
  ) {
    getDataHub()
      .register(call.request.address, call.request.name, call.request.index, call.request.commitment)
      .then((txHash) => {
        log.info(`${call.request.address} register data ${call.request.name} block ${call.request.index}`);
        callback(null, { txHash: txHash });
      })
      .catch((err) => {
        log.error(err);
        callback(err, null);
      });
  },

  GetDataCommitment(
    call: grpc.ServerUnaryCall<DataCommitmentReq__Output, DataCommitmentResp>,
    callback: grpc.sendUnaryData<DataCommitmentResp>
  ) {
    getDataHub()
      .getDataCommitment(call.request.address, call.request.name, call.request.index)
      .then((commitment) => {
        log.info(`get ${call.request.address} data ${call.request.name} block ${call.request.index}`);
        callback(null, { commitment: commitment });
      })
      .catch((err) => {
        log.error(err);
        callback(err, null);
      });
  },
};

export function addService(server: grpc.Server): void {
  const definition = protoloader.loadSync(__dirname + "/../proto/datahub.proto", {
    defaults: true,
    oneofs: true,
  });
  const proto = grpc.loadPackageDefinition(definition) as unknown as ProtoGrpcType;
  server.addService(proto.datahub.DataHub.service, service);
}
