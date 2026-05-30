-- =============================================================
-- FAI-TCC-2026 — Criação de banco, usuários e permissões
-- Executar como root/DBA apenas uma vez por ambiente
-- NÃO versionar senhas reais — use variáveis de ambiente
-- =============================================================

-- Banco principal
CREATE DATABASE IF NOT EXISTS fai_tcc_2026
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Usuário da aplicação (sem root, sem GRANT ALL)
CREATE USER IF NOT EXISTS 'fai_app_user'@'%' IDENTIFIED BY '${FAI_APP_DB_PASSWORD}';
GRANT SELECT, INSERT, UPDATE, DELETE ON fai_tcc_2026.* TO 'fai_app_user'@'%';

-- Usuário de backup (somente leitura estrutural)
CREATE USER IF NOT EXISTS 'fai_backup_user'@'localhost' IDENTIFIED BY '${FAI_BACKUP_DB_PASSWORD}';
GRANT SELECT, LOCK TABLES, SHOW VIEW, TRIGGER ON fai_tcc_2026.* TO 'fai_backup_user'@'localhost';

-- Usuário auditoria (somente leitura)
CREATE USER IF NOT EXISTS 'fai_auditor_user'@'localhost' IDENTIFIED BY '${FAI_AUDITOR_DB_PASSWORD}';
GRANT SELECT ON fai_tcc_2026.* TO 'fai_auditor_user'@'localhost';

FLUSH PRIVILEGES;
