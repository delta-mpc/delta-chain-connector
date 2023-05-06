import * as grpc from "@grpc/grpc-js";
import { addService } from "./service";
import * as impl from "./impl";
import log from "~/log";

export function run(host: string, port: number): void {
  const server = new grpc.Server({
    "grpc.keepalive_time_ms": 3600000,
    "grpc.keepalive_timeout_ms": 20000,
    "grpc.keepalive_permit_without_calls": 1,
    "grpc.max_pings_without_data": 0,
  });
  addService(server);
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
