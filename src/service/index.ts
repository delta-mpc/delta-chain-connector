import { Server } from "@grpc/grpc-js";
import * as identity from "./identity";
import * as horizontal from "./horizontal";

export function addService(server: Server): void {
  identity.addService(server);
  horizontal.addService(server);
}
