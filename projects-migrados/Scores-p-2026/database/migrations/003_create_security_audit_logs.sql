-- Migration 003 — Auditoria de segurança
USE scores_p_2026;

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
  INDEX idx_audit_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
