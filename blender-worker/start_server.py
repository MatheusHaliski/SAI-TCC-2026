from __future__ import annotations

import importlib
import logging
import os
import subprocess
import sys
from pathlib import Path


logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO").upper(),
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger("stylistai.startup")


def verify_runtime() -> None:
    cwd = Path.cwd()
    handler_path = cwd / "handler.py"
    logger.info("startup_check cwd=%s", cwd)

    if not handler_path.exists():
        raise FileNotFoundError(f"Missing handler.py in working directory: {handler_path}")
    logger.info("startup_check handler.py found at %s", handler_path)

    handler_module = importlib.import_module("handler")
    if not hasattr(handler_module, "app"):
        raise AttributeError("handler.py does not export a FastAPI variable named `app`.")
    logger.info("startup_check handler:app export is present")

    importlib.import_module("fastapi")
    importlib.import_module("uvicorn")
    logger.info("startup_check fastapi and uvicorn imports succeeded")


def run_uvicorn() -> int:
    host = "0.0.0.0"
    port = os.getenv("PORT", "8000")
    cmd = [
        sys.executable,
        "-m",
        "uvicorn",
        "handler:app",
        "--host",
        host,
        "--port",
        port,
        "--log-level",
        "info",
    ]
    logger.info("starting_uvicorn command=%s", " ".join(cmd))
    process = subprocess.run(cmd, check=False)
    return process.returncode


if __name__ == "__main__":
    try:
        verify_runtime()
        rc = run_uvicorn()
        if rc != 0:
            logger.error("uvicorn exited with status=%s", rc)
        sys.exit(rc)
    except Exception:
        logger.exception("startup_failed before uvicorn boot")
        sys.exit(1)
