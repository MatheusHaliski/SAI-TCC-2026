-- Migration 002 — Pontuações e histórico
USE scores_p_2026;

CREATE TABLE IF NOT EXISTS score_categories (
  category_id BIGINT      PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(120) NOT NULL UNIQUE,
  description TEXT         NULL,
  max_score   INT          NOT NULL DEFAULT 100,
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS scores (
  score_id    BIGINT       PRIMARY KEY AUTO_INCREMENT,
  user_id     BIGINT       NOT NULL,
  category_id BIGINT       NOT NULL,
  value       DECIMAL(10,2) NOT NULL,
  awarded_by  BIGINT       NULL COMMENT 'user_id do admin que concedeu',
  notes       TEXT         NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at  DATETIME     NULL,
  CONSTRAINT fk_scores_user      FOREIGN KEY (user_id)     REFERENCES users(user_id),
  CONSTRAINT fk_scores_category  FOREIGN KEY (category_id) REFERENCES score_categories(category_id),
  CONSTRAINT fk_scores_awarded   FOREIGN KEY (awarded_by)  REFERENCES users(user_id) ON DELETE SET NULL,
  INDEX idx_scores_user (user_id),
  INDEX idx_scores_category (category_id),
  INDEX idx_scores_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS score_history (
  history_id  BIGINT       PRIMARY KEY AUTO_INCREMENT,
  score_id    BIGINT       NOT NULL,
  user_id     BIGINT       NOT NULL,
  old_value   DECIMAL(10,2) NULL,
  new_value   DECIMAL(10,2) NOT NULL,
  changed_by  BIGINT       NOT NULL COMMENT 'user_id do responsável pela alteração',
  reason      TEXT         NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_score_history_score    FOREIGN KEY (score_id)   REFERENCES scores(score_id),
  CONSTRAINT fk_score_history_user     FOREIGN KEY (user_id)    REFERENCES users(user_id),
  CONSTRAINT fk_score_history_changed  FOREIGN KEY (changed_by) REFERENCES users(user_id),
  INDEX idx_score_history_score (score_id),
  INDEX idx_score_history_user (user_id),
  INDEX idx_score_history_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reports (
  report_id   BIGINT       PRIMARY KEY AUTO_INCREMENT,
  title       VARCHAR(180) NOT NULL,
  generated_by BIGINT      NOT NULL,
  filters     JSON         NULL,
  file_url    VARCHAR(512) NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reports_user FOREIGN KEY (generated_by) REFERENCES users(user_id),
  INDEX idx_reports_user (generated_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
