import * as protoloader from "@grpc/proto-loader";
import * as grpc from "@grpc/grpc-js";
import { ProtoGrpcType } from "./chain";
import { chainService } from "./service";
import { impl } from "src/impl";

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
      console.error(`Server error: ${err.message}`);
    } else {
      console.log(`Server bind on port ${p}`);
      console.log("service init");
      impl
        .init()
        .then(() => {
          console.log("service init finished");
          console.log("server start");
          server.start();
        })
        .catch((err: Error) => {
          console.log(`service init error ${err.message}`);
        });
    }
  });
}
