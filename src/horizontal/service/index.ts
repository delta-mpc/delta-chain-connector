import { Server } from "@grpc/grpc-js";
import * as grpc from "@grpc/grpc-js";
import * as protoloader from "@grpc/proto-loader";
import { ProtoGrpcType } from "./horizontal";
import { service } from "./service";

export function addService(server: Server): void {
  const definition = protoloader.loadSync(__dirname + "/../../proto/horizontal.proto", {
    defaults: true,
    oneofs: true,
  });
  const proto = grpc.loadPackageDefinition(definition) as unknown as ProtoGrpcType;
  server.addService(proto.horizontal.Horizontal.service, service);
}
