#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${WORKER_APP_DIR:-/app}"
SYNC_DIR="${WORKER_CODE_SYNC_DIR:-}"
SYNC_GIT="${WORKER_CODE_SYNC_GIT:-}"
SYNC_REF="${WORKER_CODE_SYNC_REF:-main}"
PORT="${PORT:-8000}"

copy_from_sync_dir() {
  if [[ -n "${SYNC_DIR}" && -d "${SYNC_DIR}" ]]; then
    echo "[bootstrap] syncing worker code from ${SYNC_DIR}"
    cp -a "${SYNC_DIR}/." "${APP_DIR}/"
  fi
}

pull_from_git() {
  if [[ -z "${SYNC_GIT}" ]]; then
    return
  fi

  echo "[bootstrap] syncing worker code from git repo ${SYNC_GIT} (ref=${SYNC_REF})"
  rm -rf /tmp/worker-src
  git clone --depth 1 --branch "${SYNC_REF}" "${SYNC_GIT}" /tmp/worker-src
  if [[ -d /tmp/worker-src/blender-worker ]]; then
    cp -a /tmp/worker-src/blender-worker/. "${APP_DIR}/"
  else
    cp -a /tmp/worker-src/. "${APP_DIR}/"
  fi
}

copy_from_sync_dir
pull_from_git

echo "[bootstrap] starting uvicorn on port ${PORT}"
exec python -m uvicorn handler:app --host 0.0.0.0 --port "${PORT}" --log-level info
