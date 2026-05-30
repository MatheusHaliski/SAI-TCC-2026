#!/usr/bin/env bash
# restore-mysql.sh — Restauração segura do banco scores_p_2026
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="${PROJECT_DIR}/../../.env"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  source "$ENV_FILE"
  set +a
fi

BACKUP_FILE="${1:?Uso: $0 <backup.sql.gz>}"
[[ -f "$BACKUP_FILE" ]] || { echo "ERRO: Arquivo não encontrado: $BACKUP_FILE" >&2; exit 1; }

DB_HOST="${SCORES_DB_HOST:?SCORES_DB_HOST is required}"
DB_PORT="${SCORES_DB_PORT:-3306}"
DB_NAME="${SCORES_DB_NAME:?SCORES_DB_NAME is required}"
DB_USER="${SCORES_DB_USER:?SCORES_DB_USER is required}"
DB_PASS="${SCORES_DB_PASSWORD:?SCORES_DB_PASSWORD is required}"

CHECKSUM_FILE="${BACKUP_FILE%.gz}.sha256"
if [[ -f "$CHECKSUM_FILE" ]]; then
  EXPECTED=$(awk '{print $1}' "$CHECKSUM_FILE")
  ACTUAL=$(gunzip -c "$BACKUP_FILE" | sha256sum | awk '{print $1}')
  [[ "$EXPECTED" == "$ACTUAL" ]] || { echo "ERRO: Checksum inválido." >&2; exit 1; }
  echo "Checksum OK."
fi

echo ""
echo "ATENÇÃO: Isso irá sobrescrever ${DB_NAME} em ${DB_HOST}:${DB_PORT}"
read -r -p "Digite 'CONFIRMAR' para prosseguir: " CONFIRM
[[ "$CONFIRM" == "CONFIRMAR" ]] || { echo "Operação cancelada."; exit 0; }

gunzip -c "$BACKUP_FILE" | MYSQL_PWD="$DB_PASS" mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" "$DB_NAME"
echo "[$(date +%H:%M:%S)] Restauração concluída."
