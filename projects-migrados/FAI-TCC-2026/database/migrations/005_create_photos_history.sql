-- Migration 005 — Fotos e histórico de vestimenta
USE fai_tcc_2026;

CREATE TABLE IF NOT EXISTS photos (
  photo_id      BIGINT      PRIMARY KEY AUTO_INCREMENT,
  user_id       BIGINT      NOT NULL,
  outfit_id     BIGINT      NULL,
  image_url     VARCHAR(512) NOT NULL,
  caption       VARCHAR(255) NULL,
  is_private    BOOLEAN     NOT NULL DEFAULT TRUE,
  taken_at      DATE        NULL,
  created_at    DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at    DATETIME    NULL,
  CONSTRAINT fk_photos_user   FOREIGN KEY (user_id)   REFERENCES users(user_id),
  CONSTRAINT fk_photos_outfit FOREIGN KEY (outfit_id) REFERENCES outfits(outfit_id) ON DELETE SET NULL,
  INDEX idx_photos_user (user_id),
  INDEX idx_photos_taken (taken_at),
  INDEX idx_photos_private (is_private)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS wear_history (
  wear_id       BIGINT      PRIMARY KEY AUTO_INCREMENT,
  user_id       BIGINT      NOT NULL,
  outfit_id     BIGINT      NULL,
  wardrobe_item_id BIGINT   NULL,
  worn_at       DATE        NOT NULL,
  notes         TEXT        NULL,
  photo_id      BIGINT      NULL,
  created_at    DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_wear_history_user    FOREIGN KEY (user_id)         REFERENCES users(user_id),
  CONSTRAINT fk_wear_history_outfit  FOREIGN KEY (outfit_id)       REFERENCES outfits(outfit_id) ON DELETE SET NULL,
  CONSTRAINT fk_wear_history_item    FOREIGN KEY (wardrobe_item_id) REFERENCES wardrobe_items(wardrobe_item_id) ON DELETE SET NULL,
  CONSTRAINT fk_wear_history_photo   FOREIGN KEY (photo_id)        REFERENCES photos(photo_id) ON DELETE SET NULL,
  INDEX idx_wear_history_user (user_id),
  INDEX idx_wear_history_date (worn_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS search_filters (
  filter_id     BIGINT      PRIMARY KEY AUTO_INCREMENT,
  user_id       BIGINT      NOT NULL,
  filter_name   VARCHAR(120) NOT NULL,
  filter_config JSON        NOT NULL,
  created_at    DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_search_filters_user FOREIGN KEY (user_id) REFERENCES users(user_id),
  INDEX idx_search_filters_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
