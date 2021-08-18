from typing import Iterable, List, Optional

from coordinator import config
from coordinator.impl.utils import Event, NodesResp

from .client import Client

_client: Optional[Client] = None


def init():
    global _client
    _client = Client(config.substrate_address)


def get_nodes(page: int = 1, page_size: int = 20) -> NodesResp:
    return NodesResp(nodes=[], total_pages=0)


def register_node(url: str) -> str:
    assert _client is not None
    return _client.register_node(url)


def create_task(node_id: str, task_name: str) -> int:
    assert _client is not None
    return _client.create_task(node_id, task_name)


def join_task(node_id: str, task_id: int) -> bool:
    assert _client is not None
    return _client.join_task(node_id, task_id)


def start_round(node_id: str, task_id: int) -> int:
    assert _client is not None
    return _client.start_round(node_id, task_id)


def publish_pub_key(node_id: str, task_id: int, round_id: int, pub_key: str):
    assert _client is not None
    return _client.publish_pub_key(node_id, task_id, round_id, pub_key)


def subscribe(node_id: str) -> Iterable[Event]:
    assert _client is not None
    yield from _client.subscribe(node_id)


def unsubscribe(node_id: str):
    assert _client is not None
    _client.unsubscribe(node_id)
