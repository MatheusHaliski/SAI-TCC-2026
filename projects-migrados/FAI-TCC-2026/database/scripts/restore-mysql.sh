#!/usr/bin/env bash
# restore-mysql.sh — Restauração segura do banco fai_tcc_2026
# Exige confirmação explícita, valida checksum e nunca roda automaticamente em produção

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="${PROJECT_DIR}/../../.env"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

BACKUP_FILE="${1:?Uso: $0 <caminho-do-backup.sql.gz>}"

if [[ ! -f "$BACKUP_FILE" ]]; then
  echo "ERRO: Arquivo de backup não encontrado: $BACKUP_FILE" >&2
  exit 1
fi

DB_HOST="${FAI_DB_HOST:?FAI_DB_HOST is required}"
DB_PORT="${FAI_DB_PORT:-3306}"
DB_NAME="${FAI_DB_NAME:?FAI_DB_NAME is required}"
DB_USER="${FAI_DB_USER:?FAI_DB_USER is required}"
DB_PASS="${FAI_DB_PASSWORD:?FAI_DB_PASSWORD is required}"

CHECKSUM_FILE="${BACKUP_FILE%.gz}.sha256"
if [[ -f "$CHECKSUM_FILE" ]]; then
  echo "[$(date +%H:%M:%S)] Verificando checksum..."
  EXPECTED=$(awk '{print $1}' "$CHECKSUM_FILE")
  ACTUAL=$(gunzip -c "$BACKUP_FILE" | sha256sum | awk '{print $1}')
  if [[ "$EXPECTED" != "$ACTUAL" ]]; then
    echo "ERRO: Checksum inválido! O arquivo pode estar corrompido." >&2
    exit 1
  fi
  echo "[$(date +%H:%M:%S)] Checksum OK."
fi

echo ""
echo "============================================================"
echo "  ATENÇÃO: RESTAURAÇÃO DE BANCO DE DADOS"
echo "  Banco: ${DB_NAME} em ${DB_HOST}:${DB_PORT}"
echo "  Arquivo: $(basename "$BACKUP_FILE")"
echo "  Esta operação SOBRESCREVE os dados existentes."
echo "============================================================"
echo ""
read -r -p "Digite 'CONFIRMAR' para prosseguir: " CONFIRM

if [[ "$CONFIRM" != "CONFIRMAR" ]]; then
  echo "Operação cancelada."
  exit 0
fi

echo "[$(date +%H:%M:%S)] Iniciando restauração..."
gunzip -c "$BACKUP_FILE" | MYSQL_PWD="$DB_PASS" mysql \
  -h "$DB_HOST" \
  -P "$DB_PORT" \
  -u "$DB_USER" \
  "$DB_NAME"

echo "[$(date +%H:%M:%S)] Restauração concluída com sucesso."
