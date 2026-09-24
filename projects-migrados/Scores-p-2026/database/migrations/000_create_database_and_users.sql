-- =============================================================
-- Scores-p-2026 — Criação de banco, usuários e permissões
--
-- NÃO execute este arquivo diretamente com mysql < 000_*.sql.
-- MySQL não expande variáveis shell — as senhas ficariam literais.
--
-- USE o script wrapper:
--   ./database/scripts/setup-users.sh
--
-- Este arquivo serve como documentação e referência da estrutura.
-- =============================================================

CREATE DATABASE IF NOT EXISTS scores_p_2026
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Senha definida via SCORES_APP_DB_PASSWORD no .env
CREATE USER IF NOT EXISTS 'scores_app_user'@'%' IDENTIFIED BY 'SENHA_DEFINIDA_PELO_SCRIPT';
GRANT SELECT, INSERT, UPDATE, DELETE ON scores_p_2026.* TO 'scores_app_user'@'%';

-- Senha definida via SCORES_BACKUP_DB_PASSWORD no .env
CREATE USER IF NOT EXISTS 'scores_backup_user'@'localhost' IDENTIFIED BY 'SENHA_DEFINIDA_PELO_SCRIPT';
GRANT SELECT, LOCK TABLES, SHOW VIEW, TRIGGER ON scores_p_2026.* TO 'scores_backup_user'@'localhost';

-- Senha definida via SCORES_AUDITOR_DB_PASSWORD no .env
CREATE USER IF NOT EXISTS 'scores_auditor_user'@'localhost' IDENTIFIED BY 'SENHA_DEFINIDA_PELO_SCRIPT';
GRANT SELECT ON scores_p_2026.* TO 'scores_auditor_user'@'localhost';

FLUSH PRIVILEGES;
