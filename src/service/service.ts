import * as grpc from "@grpc/grpc-js";
import { service } from "src/impl";
import { ChainHandlers } from "./chain/Chain";
import { Empty } from "./chain/Empty";
import { JoinReq__Output } from "./chain/JoinReq";
import { JoinResp } from "./chain/JoinResp";
import { LeaveReq__Output } from "./chain/LeaveReq";
import { UpdateNameReq__Output } from "./chain/UpdateNameReq";
import { UpdateUrlReq__Output } from "./chain/UpdateUrlReq";

const chainServer: ChainHandlers = {
  Join(call: grpc.ServerUnaryCall<JoinReq__Output, JoinResp>, callback: grpc.sendUnaryData<JoinResp>) {
    const url = call.request.url;
    const name = call.request.name;

    service
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

    service
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

    service
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

    service
      .leave(address)
      .then(() => {
        callback(null, {});
      })
      .catch((err: Error) => {
        callback(err, null);
      });
  },
};
