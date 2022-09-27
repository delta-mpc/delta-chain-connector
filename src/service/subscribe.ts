import * as grpc from "@grpc/grpc-js";
import * as protoloader from "@grpc/proto-loader";
import { PassThrough } from "stream";
import { DataRegisteredEvent, HLREvent, HorizontalEvent } from "~/event";
import { getDataHub, getHLR } from "~/impl";
import { getHorizontal } from "~/impl/horizontal";
import log from "~/log";
import { ProtoGrpcType } from "~/proto/subscribe";
import { Event } from "~/proto/subscribe/Event";
import { EventReq__Output } from "~/proto/subscribe/EventReq";
import { SubscribeHandlers } from "~/proto/subscribe/Subscribe";

function horzontalSubscribe(address: string): PassThrough {
  const dst = new PassThrough({ objectMode: true });
  const src = getHorizontal().subscribe(address);
  src.on("data", (event: HorizontalEvent) => {
    switch (event.type) {
      case "TaskCreated":
        dst.write({
          taskCreated: {
            address: event.address,
            url: event.url,
            taskId: event.taskID,
            dataset: event.dataset,
            commitment: event.commitment,
            taskType: event.taskType,
          },
        });
        break;
      case "RoundStarted":
        dst.write({
          roundStarted: {
            taskId: event.taskID,
            round: event.round,
          },
        });
        break;
      case "RoundEnded":
        dst.write({
          roundEnded: {
            taskId: event.taskID,
            round: event.round,
          },
        });
        break;
      case "PartnerSelected":
        dst.write({
          partnerSelected: {
            taskId: event.taskID,
            round: event.round,
            addrs: event.addrs,
          },
        });
        break;
      case "CalculationStarted":
        dst.write({
          calculationStarted: {
            taskId: event.taskID,
            round: event.round,
            addrs: event.addrs,
          },
        });
        break;
      case "AggregationStarted":
        dst.write({
          aggregationStarted: {
            taskId: event.taskID,
            round: event.round,
            addrs: event.addrs,
          },
        });
        break;
      case "TaskFinished":
        dst.write({
          taskFinished: {
            taskId: event.taskID,
          },
        });
    }
  });
  dst.on("close", () => {
    getHorizontal().unsubscribe(src);
  });
  return dst;
}

function datahubSubscribe(address: string) {
  const dst = new PassThrough({ objectMode: true });
  const src = getDataHub().subscribe(address);
  src.on("data", (event: DataRegisteredEvent) => {
    dst.write({
      dataRegistered: event,
    });
  });
  dst.on("close", () => {
    getDataHub().unsubscribe(src);
  });
  return dst;
}

function hlrSubscribe(address: string) {
  const dst = new PassThrough({ objectMode: true });
  const src = getHLR().subscribe(address);
  src.on("data", (event: HLREvent) => {
    switch (event.type) {
      case "HLRTaskCreated":
        dst.write({
          taskCreated: {
            address: event.address,
            url: event.url,
            taskId: event.taskID,
            dataset: event.dataset,
            commitment: event.commitment,
            taskType: event.taskType,
            enableVerify: event.enableVerify,
            tolerance: event.tolerance,
          },
        });
        break;
      case "RoundStarted":
        dst.write({
          roundStarted: {
            taskId: event.taskID,
            round: event.round,
          },
        });
        break;
      case "RoundEnded":
        dst.write({
          roundEnded: {
            taskId: event.taskID,
            round: event.round,
          },
        });
        break;
      case "PartnerSelected":
        dst.write({
          partnerSelected: {
            taskId: event.taskID,
            round: event.round,
            addrs: event.addrs,
          },
        });
        break;
      case "CalculationStarted":
        dst.write({
          calculationStarted: {
            taskId: event.taskID,
            round: event.round,
            addrs: event.addrs,
          },
        });
        break;
      case "AggregationStarted":
        dst.write({
          aggregationStarted: {
            taskId: event.taskID,
            round: event.round,
            addrs: event.addrs,
          },
        });
        break;
      case "TaskFinished":
        dst.write({
          taskFinished: {
            taskId: event.taskID,
          },
        });
        break;
      case "TaskMemberVerified":
        dst.write({
          taskMemberVerified: {
            taskId: event.taskID,
            address: event.address,
            verified: event.verified,
          },
        });
        break;
      case "TaskVerificationConfirmed":
        dst.write({
          taskVerificationConfirmed: {
            taskId: event.taskID,
          },
        });
    }
  });
  dst.on("close", () => {
    getHLR().unsubscribe(src);
  });
  return dst;
}

const service: SubscribeHandlers = {
  Subscribe(call: grpc.ServerWritableStream<EventReq__Output, Event>) {
    const address = call.request.address;
    const timeout = call.request.timeout;

    const datahubDst = datahubSubscribe(address);
    datahubDst.on("data", (event: Event) => {
      call.write(event);
    });
    const horizontalDst = horzontalSubscribe(address);
    horizontalDst.on("data", (event: Event) => {
      call.write(event);
    });
    const hlrDst = hlrSubscribe(address);
    hlrDst.on("data", (event: Event) => {
      call.write(event);
    });
    let timer: NodeJS.Timer | null = null;
    if (timeout > 0) {
      timer = setInterval(() => {
        call.write({
          heartbeat: {
            type: "Heartbeat",
          },
        });
        log.debug("write heartbeat");
      }, timeout * 1000);
    }
    call.on("error", () => {
      if (timer) {
        clearInterval(timer);
      }
      datahubDst.destroy();
      horizontalDst.destroy();
      hlrDst.destroy();
      call.end();
    });
    call.on("cancelled", () => {
      if (timer) {
        clearInterval(timer);
      }
      datahubDst.destroy();
      horizontalDst.destroy();
      hlrDst.destroy();
      call.end();
    });
  },
};

export function addService(server: grpc.Server): void {
  const definition = protoloader.loadSync(__dirname + "/../proto/subscribe.proto", {
    defaults: true,
    oneofs: true,
  });
  const proto = grpc.loadPackageDefinition(definition) as unknown as ProtoGrpcType;
  server.addService(proto.subscribe.Subscribe.service, service);
}
