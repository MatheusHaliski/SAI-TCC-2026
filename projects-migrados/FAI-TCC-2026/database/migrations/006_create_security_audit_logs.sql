-- Migration 006 — Tabela de auditoria de segurança
USE fai_tcc_2026;

CREATE TABLE IF NOT EXISTS security_audit_logs (
  id          BIGINT      PRIMARY KEY AUTO_INCREMENT,
  user_id     BIGINT      NULL,
  action      VARCHAR(120) NOT NULL,
  entity_name VARCHAR(120) NULL,
  entity_id   VARCHAR(120) NULL,
  ip_address  VARCHAR(45)  NULL,
  user_agent  TEXT         NULL,
  metadata    JSON         NULL,
  created_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
  INDEX idx_audit_user (user_id),
  INDEX idx_audit_action (action),
  INDEX idx_audit_created (created_at),
  INDEX idx_audit_entity (entity_name, entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Eventos monitorados:
-- login_success, login_failed, logout
-- wardrobe_item_created, wardrobe_item_updated, wardrobe_item_deleted
-- outfit_created, outfit_updated, outfit_deleted
-- photo_uploaded, photo_deleted
-- profile_updated
-- access_denied
-- permission_changed
-- data_exported
-- backup_restored
-- password_changed
-- session_revoked
