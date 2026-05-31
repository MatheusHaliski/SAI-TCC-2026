#!/usr/bin/env bash
# verify-backup.sh — Validação pós-migração do banco fai_tcc_2026

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

DB_HOST="${FAI_DB_HOST:?FAI_DB_HOST is required}"
DB_PORT="${FAI_DB_PORT:-3306}"
DB_NAME="${FAI_DB_NAME:?FAI_DB_NAME is required}"
DB_USER="${FAI_DB_USER:?FAI_DB_USER is required}"
DB_PASS="${FAI_DB_PASSWORD:?FAI_DB_PASSWORD is required}"

run_query() {
  MYSQL_PWD="$DB_PASS" mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" "$DB_NAME" -sNe "$1"
}

echo "============================================================"
echo "  Validação pós-migração: ${DB_NAME}"
echo "============================================================"

echo ""
echo "--- Conexão ---"
run_query "SELECT 'OK' AS connection_status;" && echo "Conexão: OK" || { echo "ERRO: Conexão falhou"; exit 1; }

echo ""
echo "--- Tabelas existentes ---"
run_query "SHOW TABLES;"

echo ""
echo "--- Contagem de registros ---"
for table in users user_sessions brands markets piece_items wardrobe_items outfits outfit_items outfit_cards photos wear_history security_audit_logs; do
  COUNT=$(run_query "SELECT COUNT(*) FROM ${table};" 2>/dev/null || echo "N/A")
  printf "  %-30s %s registros\n" "$table" "$COUNT"
done

echo ""
echo "--- Verificação de usuários do banco ---"
run_query "SELECT user, host FROM mysql.user WHERE user LIKE 'fai_%';" 2>/dev/null || echo "  (sem acesso a mysql.user)"

echo ""
echo "--- Verificação de índices críticos ---"
run_query "SHOW INDEX FROM users;" 2>/dev/null | awk '{print "  " $3 " on " $5}'

echo ""
echo "Validação concluída."
