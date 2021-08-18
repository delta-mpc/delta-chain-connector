import logging
from concurrent import futures
from typing import Optional

import grpc
from coordinator import config, impl

from . import chain_pb2, chain_pb2_grpc

_logger = logging.getLogger(__name__)

impl.init()


class Servicer(chain_pb2_grpc.ChainServicer):
    def GetNodes(self, request, context):
        page = request.page
        page_size = request.page_size
        if page == 0:
            page = 1
        if page_size == 0:
            page_size = 20

        try:
            node_resp = impl.get_nodes(page, page_size)
            node_list = [
                chain_pb2.Node(id=node.id, url=node.url, name=node.name) for node in node_resp.nodes
            ]
            return chain_pb2.NodesResp(
                nodes=node_list, total_pages=node_resp.total_pages
            )
        except ValueError as e:
            _logger.exception(e)
            context.abort(grpc.StatusCode.INTERNAL, str(e))
        except Exception as e:
            _logger.exception(e)
            context.abort(grpc.StatusCode.INTERNAL, str(e))

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
            _logger.info(
                f"node {node_id} publish public key {key} of task {task_id} in round {round_id}"
            )
            return chain_pb2.KeyResp(success=True)
        except ValueError as e:
            _logger.exception(e)
            context.abort(grpc.StatusCode.INTERNAL, str(e))
        except Exception as e:
            _logger.exception(e)
            context.abort(grpc.StatusCode.INTERNAL, str(e))

    def Events(self, request, context):
        node_id = request.node_id
        impl.unsubscribe(node_id)

        def on_end():
            _logger.info(f"node {node_id} unsubscribe events")
            impl.unsubscribe(node_id)

        context.add_callback(on_end)

        try:
            _logger.info(f"node {node_id} subscribes events")
            for event in impl.subscribe(node_id):
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
