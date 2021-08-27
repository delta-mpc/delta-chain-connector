import logging
import threading
from collections import defaultdict
from queue import Empty, Queue
from typing import DefaultDict, Iterable, List

from coordinator.impl.utils import Event, Node, NodesResp
from sqlalchemy.orm import Session
from sqlalchemy import desc, func

from . import db, model

_logger = logging.getLogger(__name__)

_subscribe_queues: DefaultDict[str, Queue] = defaultdict(Queue)
_subscribe_cancel_events: DefaultDict[str, threading.Event] = defaultdict(
    threading.Event
)


def _publish_event(event: Event):
    for q in _subscribe_queues.values():
        q.put(event)


@db.with_session
def get_nodes(
    page: int = 1, page_size: int = 20, *, session: Session = None
) -> NodesResp:
    assert session is not None
    nodes = (
        session.query(model.Node)
        .order_by(model.Node.id)
        .limit(page_size)
        .offset((page - 1) * page_size)
        .all()
    )
    node_list = [Node(id=node.address, url=node.url, name=node.name) for node in nodes]
    count = session.query(func.count(model.Task.id)).scalar()
    total_pages = (count + page_size - 1) // page_size
    resp = NodesResp(nodes=node_list, total_pages=total_pages)
    return resp


@db.with_session
def register_node(url: str, *, session: Session = None) -> str:
    assert session is not None
    node = session.query(model.Node).filter(model.Node.url == url).first()
    if node is not None:
        return node.address
    # create node
    node = model.Node(url=url)
    session.add(node)
    session.commit()
    session.refresh(node)
    address = node.generate_address()
    node.generate_name()
    session.add(node)
    session.commit()
    return address


@db.with_session
def create_task(node_id: str, name: str, *, session: Session = None) -> int:
    assert session is not None
    node = session.query(model.Node).filter(model.Node.address == node_id).one_or_none()
    if node is None:
        raise ValueError(f"node {node_id} does not exist")

    # create task
    task = model.Task(name=name, creator=node_id)
    session.add(task)
    session.commit()
    session.refresh(task)

    task_id = task.id
    event = Event(name="Task", task_id=task_id, address=node_id, url=node.url)
    _publish_event(event)
    return task_id


@db.with_session
def join_task(node_id: str, task_id: int, *, session: Session = None) -> bool:
    assert session is not None
    # check if node existed
    q = session.query(model.Node).filter(model.Node.address == node_id)
    existed = session.query(q.exists()).scalar()
    if not existed:
        raise ValueError(f"node {node_id} does not exist")
    # check if node is a member of the task
    q = (
        session.query(model.TaskMember)
        .filter(model.TaskMember.task_id == task_id)
        .filter(model.TaskMember.member_id == node_id)
    )
    existed = session.query(q.exists()).scalar()
    if existed:
        raise ValueError(f"node {node_id} has already participate in the task")
    # change member status
    member = model.TaskMember(task_id=task_id, member_id=node_id)
    session.add(member)
    session.commit()
    event = Event(name="Join", task_id=task_id, address=node_id)
    _publish_event(event)
    return True


@db.with_session
def start_round(node_id: str, task_id: int, *, session: Session = None) -> int:
    assert session is not None
    # check if task exists
    task = session.query(model.Task).filter(model.Task.id == task_id).one_or_none()
    if task is None:
        raise ValueError(f"task {task_id} does not exist")
    if task.creator != node_id:
        raise ValueError(f"Unauthorized. Only task creator can start a round")
    # find last round
    last_round = (
        session.query(model.Round)
        .filter(model.Round.task_id == task_id)
        .order_by(desc(model.Round.id))
        .first()
    )
    if last_round is None:
        round_id = 1
    else:
        round_id = last_round.round_id + 1
    new_round = model.Round(task_id=task_id, round_id=round_id)
    session.add(new_round)
    session.commit()
    event = Event(name="Train", address=node_id, task_id=task_id, epoch=round_id)
    _publish_event(event)
    return round_id


@db.with_session
def publish_pub_key(
    node_id: str, task_id: int, round_id: int, key: str, *, session: Session = None
) -> bool:
    assert session is not None
    # check if node is a member of the task
    member = (
        session.query(model.TaskMember)
        .filter(model.TaskMember.task_id == task_id)
        .filter(model.TaskMember.member_id == node_id)
        .one_or_none()
    )

    # check if round exists
    r = session.query(model.Round).filter(model.Round.id == round_id).one_or_none()
    if r is None:
        raise ValueError(f"round {round_id} not exists")
    if r.task_id != task_id:
        raise ValueError(f"round {round_id} not belongs to task {task_id}")

    if member is None:
        raise ValueError(400, f"{node_id} is not in task {task_id}'s member list")

    pub_key = model.PubKey(task_id=task_id, round_id=round_id, node_id=node_id, key=key)
    session.add(pub_key)
    session.commit()
    event = Event(
        name="PublicKey", address=node_id, task_id=task_id, epoch=round_id, key=key
    )
    _publish_event(event)
    return True


def subscribe(node_id: str) -> Iterable[Event]:
    q = _subscribe_queues[node_id]
    cancel_event = _subscribe_cancel_events[node_id]

    while not cancel_event.is_set():
        try:
            event = q.get(block=True, timeout=0.1)
            yield event
        except Empty:
            continue


def unsubscribe(node_id: str):
    if node_id in _subscribe_cancel_events:
        cancel_event = _subscribe_cancel_events[node_id]
        cancel_event.set()

        _subscribe_queues.pop(node_id)
        _subscribe_cancel_events.pop(node_id)
