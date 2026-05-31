#!/usr/bin/env bash
# verify-backup.sh — Validação pós-migração do banco scores_p_2026
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
DB_USER="${SCORES_DB_USER:?SCORES_DB_USER is required}"
DB_PASS="${SCORES_DB_PASSWORD:?SCORES_DB_PASSWORD is required}"

run_query() {
  MYSQL_PWD="$DB_PASS" mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" "$DB_NAME" -sNe "$1"
}

echo "Validação: ${DB_NAME}"
run_query "SELECT 'OK';" && echo "Conexão: OK" || { echo "ERRO: Conexão falhou"; exit 1; }
echo ""
echo "Tabelas:"
run_query "SHOW TABLES;"
echo ""
echo "Contagem:"
for table in users user_sessions score_categories scores score_history reports security_audit_logs; do
  COUNT=$(run_query "SELECT COUNT(*) FROM ${table};" 2>/dev/null || echo "N/A")
  printf "  %-35s %s registros\n" "$table" "$COUNT"
done
echo ""
echo "Validação concluída."
