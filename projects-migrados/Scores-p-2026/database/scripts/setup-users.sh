#!/usr/bin/env bash
# setup-users.sh — Cria banco scores_p_2026 e usuários MySQL com senhas do .env
# Execute como usuário com privilégios de DBA (root ou equivalente)
# Uso: ./database/scripts/setup-users.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"
ENV_FILE="${PROJECT_DIR}/.env"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

DBA_HOST="${SCORES_DB_HOST:-localhost}"
DBA_PORT="${SCORES_DB_PORT:-3306}"
DBA_USER="${SCORES_DBA_USER:-root}"

SCORES_APP_DB_PASSWORD="${SCORES_APP_DB_PASSWORD:?SCORES_APP_DB_PASSWORD is required in .env}"
SCORES_BACKUP_DB_PASSWORD="${SCORES_BACKUP_DB_PASSWORD:?SCORES_BACKUP_DB_PASSWORD is required in .env}"
SCORES_AUDITOR_DB_PASSWORD="${SCORES_AUDITOR_DB_PASSWORD:?SCORES_AUDITOR_DB_PASSWORD is required in .env}"

echo "[$(date +%H:%M:%S)] Criando banco scores_p_2026 e usuários..."

MYSQL_PWD_INPUT="${SCORES_DBA_PASSWORD:-}"

run_sql() {
  if [[ -n "$MYSQL_PWD_INPUT" ]]; then
    MYSQL_PWD="$MYSQL_PWD_INPUT" mysql -h "$DBA_HOST" -P "$DBA_PORT" -u "$DBA_USER" -e "$1"
  else
    mysql -h "$DBA_HOST" -P "$DBA_PORT" -u "$DBA_USER" -p -e "$1"
  fi
}

run_sql "CREATE DATABASE IF NOT EXISTS scores_p_2026 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
echo "[$(date +%H:%M:%S)] Banco scores_p_2026 criado."

run_sql "CREATE USER IF NOT EXISTS 'scores_app_user'@'%' IDENTIFIED BY '${SCORES_APP_DB_PASSWORD}';"
run_sql "GRANT SELECT, INSERT, UPDATE, DELETE ON scores_p_2026.* TO 'scores_app_user'@'%';"
echo "[$(date +%H:%M:%S)] Usuário scores_app_user criado."

run_sql "CREATE USER IF NOT EXISTS 'scores_backup_user'@'localhost' IDENTIFIED BY '${SCORES_BACKUP_DB_PASSWORD}';"
run_sql "GRANT SELECT, LOCK TABLES, SHOW VIEW, TRIGGER ON scores_p_2026.* TO 'scores_backup_user'@'localhost';"
echo "[$(date +%H:%M:%S)] Usuário scores_backup_user criado."

run_sql "CREATE USER IF NOT EXISTS 'scores_auditor_user'@'localhost' IDENTIFIED BY '${SCORES_AUDITOR_DB_PASSWORD}';"
run_sql "GRANT SELECT ON scores_p_2026.* TO 'scores_auditor_user'@'localhost';"
echo "[$(date +%H:%M:%S)] Usuário scores_auditor_user criado."

run_sql "FLUSH PRIVILEGES;"
echo "[$(date +%H:%M:%S)] Configuração concluída com sucesso."
