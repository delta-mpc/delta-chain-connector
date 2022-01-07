import * as protoloader from "@grpc/proto-loader";
import * as grpc from "@grpc/grpc-js";
import { ProtoGrpcType } from "./chain";
import { chainService } from "./service";
import { impl } from "~/impl";
import log from "~/log";

export function run(host: string, port: number): void {
  const definition = protoloader.loadSync(__dirname + "/./chain.proto", {
    defaults: true,
    oneofs: true,
  });
  const proto = grpc.loadPackageDefinition(definition) as unknown as ProtoGrpcType;
  const server = new grpc.Server();
  server.addService(proto.chain.Chain.service, chainService);
  server.bindAsync(`${host}:${port}`, grpc.ServerCredentials.createInsecure(), (err, p) => {
    if (err) {
      log.error(`Server error: ${err.message}`);
    } else {
      log.info(`Server bind on port ${p}`);
      log.info("service init");
      impl
        .init()
        .then(() => {
          log.info("service init finished");
          log.info("server start");
          server.start();
        })
        .catch((err: Error) => {
          log.info(`service init error ${err}`);
        });
    }
  });
}
