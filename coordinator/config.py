import os
from typing import Dict

import yaml

_config_path = os.getenv("COORDINATOR", "config/config.yaml")

with open(_config_path, mode="r", encoding="utf-8") as f:
    c = yaml.safe_load(f)

_log = c.get("log")
log_level = _log.get("level", "DEBUG")

impl: str = c.get("impl", "monkey")

db: str = c.get("db", "sqlite://")

host: str = c.get("host", "0.0.0.0")
port: int = c.get("port", 32301)

_substrate: Dict = c.get("substrate", dict())
substrate_address: str = _substrate.get("address", "")

