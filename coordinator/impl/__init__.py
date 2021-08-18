from typing import Iterable, List

from coordinator import config
from .utils import Event, Node, NodesResp

from . import monkey, substrate

if config.impl == "monkey":
    _impl = monkey
elif config.impl == "substrate":
    _impl = substrate
else:
    raise KeyError(f"unknown implement {config.impl}")


def init():
    _impl.init()


def get_nodes(page: int = 1, page_size: int = 20) -> NodesResp:
    return _impl.get_nodes(page=page, page_size=page_size)


def register_node(url: str) -> str:
    return _impl.register_node(url)


def create_task(node_id: str, task_name: str) -> int:
    return _impl.create_task(node_id, task_name)


def join_task(node_id: str, task_id: int) -> bool:
    return _impl.join_task(node_id, task_id)


def start_round(node_id: str, task_id: int) -> int:
    return _impl.start_round(node_id, task_id)


def publish_pub_key(node_id: str, task_id: int, round_id: int, pub_key: str):
    return _impl.publish_pub_key(node_id, task_id, round_id, pub_key)


def subscribe(node_id: str) -> Iterable[Event]:
    return _impl.subscribe(node_id)


def unsubscribe(node_id: str):
    _impl.unsubscribe(node_id)
