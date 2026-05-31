-- Migration 003 — Guarda-roupa virtual
USE fai_tcc_2026;

CREATE TABLE IF NOT EXISTS piece_items (
  piece_item_id BIGINT     PRIMARY KEY AUTO_INCREMENT,
  brand_id      BIGINT     NOT NULL,
  market_id     BIGINT     NOT NULL,
  name          VARCHAR(180) NOT NULL,
  image_url     VARCHAR(512) NOT NULL,
  piece_type    VARCHAR(80) NOT NULL,
  color         VARCHAR(80) NOT NULL,
  material      VARCHAR(80) NOT NULL,
  store_url     VARCHAR(512) NULL,
  price_range   VARCHAR(60) NULL,
  is_active     BOOLEAN    NOT NULL DEFAULT TRUE,
  created_at    DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_piece_items_brand   FOREIGN KEY (brand_id)  REFERENCES brands(brand_id),
  CONSTRAINT fk_piece_items_market  FOREIGN KEY (market_id) REFERENCES markets(market_id),
  INDEX idx_piece_items_type (piece_type),
  INDEX idx_piece_items_brand (brand_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS wardrobe_items (
  wardrobe_item_id BIGINT   PRIMARY KEY AUTO_INCREMENT,
  user_id       BIGINT      NOT NULL,
  brand_id      BIGINT      NOT NULL,
  market_id     BIGINT      NOT NULL,
  name          VARCHAR(180) NOT NULL,
  image_url     VARCHAR(512) NOT NULL,
  piece_type    VARCHAR(80) NOT NULL,
  color         VARCHAR(80) NOT NULL,
  material      VARCHAR(80) NOT NULL,
  style_tags    TEXT        NULL,
  occasion_tags TEXT        NULL,
  status        ENUM('available','unavailable','favorite','sell','donate') NOT NULL DEFAULT 'available',
  is_favorite   BOOLEAN     NOT NULL DEFAULT FALSE,
  model_3d_url  VARCHAR(512) NULL,
  model_status  ENUM('none','queued','processing','done','failed') NOT NULL DEFAULT 'none',
  created_at    DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at    DATETIME    NULL,
  CONSTRAINT fk_wardrobe_items_user   FOREIGN KEY (user_id)  REFERENCES users(user_id),
  CONSTRAINT fk_wardrobe_items_brand  FOREIGN KEY (brand_id) REFERENCES brands(brand_id),
  CONSTRAINT fk_wardrobe_items_market FOREIGN KEY (market_id) REFERENCES markets(market_id),
  INDEX idx_wardrobe_user (user_id),
  INDEX idx_wardrobe_type (piece_type),
  INDEX idx_wardrobe_status (status),
  INDEX idx_wardrobe_deleted (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
