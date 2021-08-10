import argparse
import os



def run():
    from . import config, log
    from .service import Server

    log.init()
    address = f"0.0.0.0:{config.port}"
    server = Server(address)
    try:
        server.start()
        server.wait_for_termination()
    finally:
        server.stop()


def init():
    config_file = os.getenv("COORDINATOR_CONFIG", "config/config.yaml")
    config_dir, _ = os.path.split(config_file)
    if not os.path.exists(config_dir):
        os.makedirs(config_dir, exist_ok=True)

    if not os.path.exists(config_file):
        from .config_example import config_example_str

        with open(config_file, mode="w", encoding="utf-8") as f:
            f.write(config_example_str)


def main():
    parser = argparse.ArgumentParser(description="delta node", prog="Delta Node")
    parser.add_argument(
        "action",
        choices=["init", "run"],
        help="delta node start action: 'init' to init delta node config, 'run' to start the node",
    )
    parser.add_argument("--version", action="version", version="%(prog)s 2.0")
    args = parser.parse_args()
    if args.action == "init":
        init()
    elif args.action == "run":
        run()
