-- =============================================================
-- Scores-p-2026 — Criação de banco, usuários e permissões
-- Executar como root/DBA apenas uma vez por ambiente
-- =============================================================

CREATE DATABASE IF NOT EXISTS scores_p_2026
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'scores_app_user'@'%' IDENTIFIED BY '${SCORES_APP_DB_PASSWORD}';
GRANT SELECT, INSERT, UPDATE, DELETE ON scores_p_2026.* TO 'scores_app_user'@'%';

CREATE USER IF NOT EXISTS 'scores_backup_user'@'localhost' IDENTIFIED BY '${SCORES_BACKUP_DB_PASSWORD}';
GRANT SELECT, LOCK TABLES, SHOW VIEW, TRIGGER ON scores_p_2026.* TO 'scores_backup_user'@'localhost';

CREATE USER IF NOT EXISTS 'scores_auditor_user'@'localhost' IDENTIFIED BY '${SCORES_AUDITOR_DB_PASSWORD}';
GRANT SELECT ON scores_p_2026.* TO 'scores_auditor_user'@'localhost';

FLUSH PRIVILEGES;
