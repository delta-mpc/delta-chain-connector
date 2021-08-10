import logging
from concurrent import futures
from typing import Optional

import grpc

from .. import config
from . import chain_pb2, chain_pb2_grpc

if config.impl == "monkey":
    from .. import monkey as impl
elif config.impl == "substrate":
    from .. import substrate as impl
else:
    raise ImportError(f"unknown implement {config.impl}")

impl.init()

_logger = logging.getLogger(__name__)


class Servicer(chain_pb2_grpc.ChainServicer):
    def RegisterNode(self, request, context):
        url = request.url
        try:
            node_id = impl.register_node(url)
            _logger.info(f"register node {node_id} url {url}")
            return chain_pb2.NodeResp(node_id=node_id)
        except ValueError as e:
            _logger.exception(e)
            context.abort(grpc.StatusCode.INTERNAL, str(e))
        except Exception as e:
            _logger.exception(e)
            context.abort(grpc.StatusCode.INTERNAL, str(e))

    def CreateTask(self, request, context):
        node_id = request.node_id
        name = request.name
        try:
            task_id = impl.create_task(node_id, name)
            _logger.info(f"node {node_id} create task {task_id} name {name}")
            return chain_pb2.TaskResp(task_id=task_id)
        except ValueError as e:
            _logger.exception(e)
            context.abort(grpc.StatusCode.INTERNAL, str(e))
        except Exception as e:
            _logger.exception(e)
            context.abort(grpc.StatusCode.INTERNAL, str(e))

    def JoinTask(self, request, context):
        node_id = request.node_id
        task_id = request.task_id
        try:
            impl.join_task(node_id, task_id)
            _logger.info(f"node {node_id} join task {task_id}")
            return chain_pb2.JoinResp(success=True)
        except ValueError as e:
            _logger.exception(e)
            context.abort(grpc.StatusCode.INTERNAL, str(e))
        except Exception as e:
            _logger.exception(e)
            context.abort(grpc.StatusCode.INTERNAL, str(e))

    def StartRound(self, request, context):
        node_id = request.node_id
        task_id = request.task_id
        try:
            round_id = impl.start_round(node_id, task_id)
            _logger.info(f"node {node_id} start round {round_id} of task {task_id}")
            return chain_pb2.RoundResp(round_id=round_id)
        except ValueError as e:
            _logger.exception(e)
            context.abort(grpc.StatusCode.INTERNAL, str(e))
        except Exception as e:
            _logger.exception(e)
            context.abort(grpc.StatusCode.INTERNAL, str(e))

    def PublishPubKey(self, request, context):
        node_id = request.node_id
        task_id = request.task_id
        round_id = request.round_id
        key = request.key
        try:
            impl.publish_pub_key(node_id, task_id, round_id, key)
            _logger.info(f"node {node_id} publish public key {key} of task {task_id} in round {round_id}")
            return chain_pb2.KeyResp(success=True)
        except ValueError as e:
            _logger.exception(e)
            context.abort(grpc.StatusCode.INTERNAL, str(e))
        except Exception as e:
            _logger.exception(e)
            context.abort(grpc.StatusCode.INTERNAL, str(e))

    def Events(self, request, context):
        node_id = request.node_id
        try:
            _logger.info(f"node {node_id} subscribes events")
            for event in impl.events(node_id):
                yield chain_pb2.EventResp(
                    name=event.name,
                    address=event.address,
                    url=event.url,
                    task_id=event.task_id,
                    epoch=event.epoch,
                    key=event.key,
                )
        except ValueError as e:
            _logger.exception(e)
            context.abort(grpc.StatusCode.INTERNAL, str(e))
        except Exception as e:
            _logger.exception(e)
            context.abort(grpc.StatusCode.INTERNAL, str(e))


class Server(object):
    def __init__(self, address: str) -> None:
        self._server = grpc.server(futures.ThreadPoolExecutor())
        self._server.add_insecure_port(address)
        chain_pb2_grpc.add_ChainServicer_to_server(Servicer(), self._server)
    
    def start(self):
        self._server.start()

    def wait_for_termination(self, timeout: Optional[float] = None):
        self._server.wait_for_termination(timeout=timeout)

    def stop(self):
        self._server.stop(True)


