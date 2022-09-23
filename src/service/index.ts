import { Server } from "@grpc/grpc-js";
import * as datahub from "./datahub";
import * as hlr from "./hlr";
import * as horizontal from "./horizontal";
import * as identity from "./identity";

export function addService(server: Server): void {
  datahub.addService(server);
  identity.addService(server);
  horizontal.addService(server);
  hlr.addService(server);
}
