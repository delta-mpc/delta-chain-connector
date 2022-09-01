import * as grpc from "@grpc/grpc-js";
import * as protoloader from "@grpc/proto-loader";
import { getIdentity } from "~/impl";
import log from "~/log";
import { ProtoGrpcType } from "~/proto/identity";
import { IdentityHandlers } from "~/proto/identity/Identity";
import { JoinReq__Output } from "~/proto/identity/JoinReq";
import { JoinResp } from "~/proto/identity/JoinResp";
import { LeaveReq__Output } from "~/proto/identity/LeaveReq";
import { NodeInfo } from "~/proto/identity/NodeInfo";
import { NodeInfoReq__Output } from "~/proto/identity/NodeInfoReq";
import { NodeInfos } from "~/proto/identity/NodeInfos";
import { NodeInfosReq__Output } from "~/proto/identity/NodeInfosReq";
import { UpdateNameReq__Output } from "~/proto/identity/UpdateNameReq";
import { UpdateUrlReq__Output } from "~/proto/identity/UpdateUrlReq";
import { Transaction } from "~/proto/transaction/Transaction";

const service: IdentityHandlers = {
  Join(call: grpc.ServerUnaryCall<JoinReq__Output, JoinResp>, callback: grpc.sendUnaryData<JoinResp>) {
    const url = call.request.url;
    const name = call.request.name;

    getIdentity()
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

    getIdentity()
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

    getIdentity()
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

    getIdentity()
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

    getIdentity()
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
    getIdentity()
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
};

export function addService(server: grpc.Server): void {
  const definition = protoloader.loadSync(__dirname + "/../proto/identity.proto", {
    defaults: true,
    oneofs: true,
  });
  const proto = grpc.loadPackageDefinition(definition) as unknown as ProtoGrpcType;
  server.addService(proto.identity.Identity.service, service);
}
