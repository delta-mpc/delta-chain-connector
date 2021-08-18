from typing import Iterable, Optional

import grpc
from tenacity import retry, retry_if_exception_type, stop_after_attempt, wait_fixed

from coordinator.impl.utils import Event
from . import mpc_pb2, mpc_pb2_grpc


class NoneRespError(Exception):
    def __init__(self):
        pass


class Client(object):
    def __init__(self, address: str) -> None:
        channel = grpc.insecure_channel(address)
        self._stub = mpc_pb2_grpc.MpcStub(channel)

        self._subscribe_futures = {}

    @retry(
        wait=wait_fixed(2),
        stop=stop_after_attempt(3),
        retry=retry_if_exception_type(NoneRespError),
    )
    def register_node(self, url: str) -> str:
        req = mpc_pb2.RegisterNodeRequest(url=url)
        e: Optional[mpc_pb2.EventResponse] = None
        for event in self._stub.registerNode(req):
            e = event
            break
        if e is None:
            raise NoneRespError
        return e.address  # type: ignore

    @retry(
        wait=wait_fixed(2),
        stop=stop_after_attempt(3),
        retry=retry_if_exception_type(NoneRespError),
    )
    def create_task(self, node_id: str, task_name: str) -> int:
        req = mpc_pb2.RegisterTaskRequest()
        e: Optional[mpc_pb2.EventResponse] = None
        for event in self._stub.registerTask(req):
            e = event
            break
        if e is None:
            raise NoneRespError
        return e.taskId  # type: ignore

    @retry(
        wait=wait_fixed(2),
        stop=stop_after_attempt(3),
        retry=retry_if_exception_type(NoneRespError),
    )
    def join_task(self, node_id: str, task_id: int) -> bool:
        req = mpc_pb2.JoinTaskRequest(task_id=task_id)
        e: Optional[mpc_pb2.EventResponse] = None
        for event in self._stub.joinTask(req):
            e = event
            break
        if e is None:
            raise NoneRespError
        return e.taskId == task_id  # type: ignore

    @retry(
        wait=wait_fixed(2),
        stop=stop_after_attempt(3),
        retry=retry_if_exception_type(NoneRespError),
    )
    def start_round(self, node_id: str, task_id: int) -> int:
        req = mpc_pb2.TrainRequest(task_id=task_id)
        e: Optional[mpc_pb2.EventResponse] = None
        for event in self._stub.train(req):
            e = event
            break
        if e is None:
            raise NoneRespError
        return e.epoch  # type: ignore

    @retry(
        wait=wait_fixed(2),
        stop=stop_after_attempt(3),
        retry=retry_if_exception_type(NoneRespError),
    )
    def publish_pub_key(self, node_id: str, task_id: int, round_id: int, pub_key: str):
        req = mpc_pb2.KeyRequest(
            task_id=task_id, epoch=round_id, key=pub_key.encode("utf-8")
        )
        e: Optional[mpc_pb2.EventResponse] = None
        for event in self._stub.key(req):
            e = event
            break
        if e is None:
            raise NoneRespError
        return e.taskId == task_id and e.epoch == round_id and e.key == pub_key  # type: ignore

    def subscribe(self, node_id: str) -> Iterable[Event]:
        req = mpc_pb2.EventRequest()

        fut = self._stub.event(req)
        self._subscribe_futures[node_id] = fut

        for e in fut:
            event = Event(
                name=e.name,
                address=e.address,
                url=e.url,
                task_id=e.taskId,
                epoch=e.epoch,
                key=e.key,
            )
            yield event

    def unsubscribe(self, node_id: str):
        if node_id in self._subscribe_futures:
            fut = self._subscribe_futures[node_id]
            fut.cancel()
