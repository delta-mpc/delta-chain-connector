from dataclasses import dataclass


@dataclass
class Event(object):
    name: str
    address: str = ""
    url: str = ""
    task_id: int = 0
    epoch: int = 0
    key: str = ""
