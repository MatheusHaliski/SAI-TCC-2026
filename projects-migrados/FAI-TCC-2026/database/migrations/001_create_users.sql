-- Migration 001 — Tabela de usuários
USE fai_tcc_2026;

CREATE TABLE IF NOT EXISTS users (
  user_id   BIGINT       PRIMARY KEY AUTO_INCREMENT,
  firebase_uid VARCHAR(128) NULL UNIQUE COMMENT 'UID do Firebase Auth para migração gradual',
  name      VARCHAR(120) NOT NULL,
  email     VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  photo_url VARCHAR(512) NULL,
  role      ENUM('user','admin','auditor') NOT NULL DEFAULT 'user',
  preferred_styles TEXT NULL,
  visibility ENUM('public','private') NOT NULL DEFAULT 'private',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role),
  INDEX idx_users_firebase_uid (firebase_uid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_sessions (
  session_id BIGINT       PRIMARY KEY AUTO_INCREMENT,
  user_id   BIGINT       NOT NULL,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  ip_address VARCHAR(45)  NULL,
  user_agent TEXT         NULL,
  expires_at DATETIME     NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  revoked_at DATETIME     NULL,
  CONSTRAINT fk_user_sessions_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_user_sessions_user (user_id),
  INDEX idx_user_sessions_token (token_hash),
  INDEX idx_user_sessions_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
