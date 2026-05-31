#!/usr/bin/env bash
# backup-mysql.sh — Backup seguro do banco scores_p_2026
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"
ENV_FILE="${PROJECT_DIR}/.env"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  source "$ENV_FILE"
  set +a
fi

DB_HOST="${SCORES_DB_HOST:?SCORES_DB_HOST is required}"
DB_PORT="${SCORES_DB_PORT:-3306}"
DB_NAME="${SCORES_DB_NAME:?SCORES_DB_NAME is required}"
DB_USER="${SCORES_BACKUP_DB_USER:?SCORES_BACKUP_DB_USER is required}"
DB_PASS="${SCORES_BACKUP_DB_PASSWORD:?SCORES_BACKUP_DB_PASSWORD is required}"
BACKUP_DIR="${BACKUP_DIR:-${PROJECT_DIR}/database/backups}"

mkdir -p "$BACKUP_DIR"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_backup_${TIMESTAMP}.sql"

echo "[$(date +%H:%M:%S)] Iniciando backup: ${DB_NAME}"
MYSQL_PWD="$DB_PASS" mysqldump \
  -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" \
  --single-transaction --routines --triggers --events --set-gtid-purged=OFF \
  "$DB_NAME" > "$BACKUP_FILE"

sha256sum "$BACKUP_FILE" > "${BACKUP_FILE}.sha256"
gzip "$BACKUP_FILE"
echo "[$(date +%H:%M:%S)] Backup concluído: ${BACKUP_FILE}.gz"
