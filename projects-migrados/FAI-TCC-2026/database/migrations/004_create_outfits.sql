-- Migration 004 — Outfits (schemes) e outfit cards
USE fai_tcc_2026;

CREATE TABLE IF NOT EXISTS outfits (
  outfit_id     BIGINT      PRIMARY KEY AUTO_INCREMENT,
  user_id       BIGINT      NOT NULL,
  title         VARCHAR(180) NOT NULL,
  description   TEXT        NULL,
  creation_mode ENUM('manual','ai') NOT NULL DEFAULT 'manual',
  style         VARCHAR(100) NOT NULL,
  occasion      VARCHAR(100) NOT NULL,
  visibility    ENUM('private','public') NOT NULL DEFAULT 'private',
  community_indexed BOOLEAN NOT NULL DEFAULT FALSE,
  cover_image_url VARCHAR(512) NULL,
  created_at    DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at    DATETIME    NULL,
  CONSTRAINT fk_outfits_user FOREIGN KEY (user_id) REFERENCES users(user_id),
  INDEX idx_outfits_user (user_id),
  INDEX idx_outfits_visibility (visibility),
  INDEX idx_outfits_deleted (deleted_at),
  INDEX idx_outfits_community (community_indexed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS outfit_items (
  outfit_item_id   BIGINT   PRIMARY KEY AUTO_INCREMENT,
  outfit_id        BIGINT   NOT NULL,
  wardrobe_item_id BIGINT   NOT NULL,
  slot             ENUM('upper','lower','shoes','accessory') NOT NULL,
  sort_order       INT      NOT NULL DEFAULT 0,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_outfit_items_outfit  FOREIGN KEY (outfit_id)        REFERENCES outfits(outfit_id) ON DELETE CASCADE,
  CONSTRAINT fk_outfit_items_wardrobe FOREIGN KEY (wardrobe_item_id) REFERENCES wardrobe_items(wardrobe_item_id),
  INDEX idx_outfit_items_outfit (outfit_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS outfit_cards (
  outfit_card_id BIGINT    PRIMARY KEY AUTO_INCREMENT,
  user_id        BIGINT    NOT NULL,
  outfit_id      BIGINT    NOT NULL,
  title          VARCHAR(180) NULL,
  notes          TEXT      NULL,
  card_image_url VARCHAR(512) NULL,
  is_published   BOOLEAN   NOT NULL DEFAULT FALSE,
  published_at   DATETIME  NULL,
  created_at     DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_outfit_cards_user   FOREIGN KEY (user_id)   REFERENCES users(user_id),
  CONSTRAINT fk_outfit_cards_outfit FOREIGN KEY (outfit_id) REFERENCES outfits(outfit_id),
  INDEX idx_outfit_cards_user (user_id),
  INDEX idx_outfit_cards_outfit (outfit_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
