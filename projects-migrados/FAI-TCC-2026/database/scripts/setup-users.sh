#!/usr/bin/env bash
# setup-users.sh — Cria banco fai_tcc_2026 e usuários MySQL com senhas do .env
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

DBA_HOST="${FAI_DB_HOST:-localhost}"
DBA_PORT="${FAI_DB_PORT:-3306}"
DBA_USER="${FAI_DBA_USER:-root}"

FAI_APP_DB_PASSWORD="${FAI_APP_DB_PASSWORD:?FAI_APP_DB_PASSWORD is required in .env}"
FAI_BACKUP_DB_PASSWORD="${FAI_BACKUP_DB_PASSWORD:?FAI_BACKUP_DB_PASSWORD is required in .env}"
FAI_AUDITOR_DB_PASSWORD="${FAI_AUDITOR_DB_PASSWORD:?FAI_AUDITOR_DB_PASSWORD is required in .env}"

echo "[$(date +%H:%M:%S)] Criando banco fai_tcc_2026 e usuários..."
echo "Host: ${DBA_HOST}:${DBA_PORT} | Usuário DBA: ${DBA_USER}"
echo ""

MYSQL_PWD_INPUT=""
if [[ -n "${FAI_DBA_PASSWORD:-}" ]]; then
  MYSQL_PWD_INPUT="$FAI_DBA_PASSWORD"
fi

run_sql() {
  if [[ -n "$MYSQL_PWD_INPUT" ]]; then
    MYSQL_PWD="$MYSQL_PWD_INPUT" mysql -h "$DBA_HOST" -P "$DBA_PORT" -u "$DBA_USER" -e "$1"
  else
    mysql -h "$DBA_HOST" -P "$DBA_PORT" -u "$DBA_USER" -p -e "$1"
  fi
}

run_sql "CREATE DATABASE IF NOT EXISTS fai_tcc_2026 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
echo "[$(date +%H:%M:%S)] Banco fai_tcc_2026 criado."

run_sql "CREATE USER IF NOT EXISTS 'fai_app_user'@'%' IDENTIFIED BY '${FAI_APP_DB_PASSWORD}';"
run_sql "GRANT SELECT, INSERT, UPDATE, DELETE ON fai_tcc_2026.* TO 'fai_app_user'@'%';"
echo "[$(date +%H:%M:%S)] Usuário fai_app_user criado."

run_sql "CREATE USER IF NOT EXISTS 'fai_backup_user'@'localhost' IDENTIFIED BY '${FAI_BACKUP_DB_PASSWORD}';"
run_sql "GRANT SELECT, LOCK TABLES, SHOW VIEW, TRIGGER ON fai_tcc_2026.* TO 'fai_backup_user'@'localhost';"
echo "[$(date +%H:%M:%S)] Usuário fai_backup_user criado."

run_sql "CREATE USER IF NOT EXISTS 'fai_auditor_user'@'localhost' IDENTIFIED BY '${FAI_AUDITOR_DB_PASSWORD}';"
run_sql "GRANT SELECT ON fai_tcc_2026.* TO 'fai_auditor_user'@'localhost';"
echo "[$(date +%H:%M:%S)] Usuário fai_auditor_user criado."

run_sql "FLUSH PRIVILEGES;"
echo "[$(date +%H:%M:%S)] Configuração concluída com sucesso."
