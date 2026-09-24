-- =============================================================
-- FAI-TCC-2026 — Criação de banco, usuários e permissões
--
-- NÃO execute este arquivo diretamente com mysql < 000_*.sql.
-- MySQL não expande variáveis shell — as senhas ficariam literais.
--
-- USE o script wrapper:
--   ./database/scripts/setup-users.sh
--
-- Este arquivo serve como documentação e referência da estrutura.
-- =============================================================

-- Banco principal
CREATE DATABASE IF NOT EXISTS fai_tcc_2026
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Usuário da aplicação (sem root, sem GRANT ALL)
-- Senha definida via FAI_APP_DB_PASSWORD no .env
CREATE USER IF NOT EXISTS 'fai_app_user'@'%' IDENTIFIED BY 'SENHA_DEFINIDA_PELO_SCRIPT';
GRANT SELECT, INSERT, UPDATE, DELETE ON fai_tcc_2026.* TO 'fai_app_user'@'%';

-- Usuário de backup (somente leitura estrutural)
-- Senha definida via FAI_BACKUP_DB_PASSWORD no .env
CREATE USER IF NOT EXISTS 'fai_backup_user'@'localhost' IDENTIFIED BY 'SENHA_DEFINIDA_PELO_SCRIPT';
GRANT SELECT, LOCK TABLES, SHOW VIEW, TRIGGER ON fai_tcc_2026.* TO 'fai_backup_user'@'localhost';

-- Usuário auditoria (somente leitura)
-- Senha definida via FAI_AUDITOR_DB_PASSWORD no .env
CREATE USER IF NOT EXISTS 'fai_auditor_user'@'localhost' IDENTIFIED BY 'SENHA_DEFINIDA_PELO_SCRIPT';
GRANT SELECT ON fai_tcc_2026.* TO 'fai_auditor_user'@'localhost';

FLUSH PRIVILEGES;
