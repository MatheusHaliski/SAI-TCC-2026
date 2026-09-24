-- Migration 002 — Marcas e mercados
USE fai_tcc_2026;

CREATE TABLE IF NOT EXISTS brands (
  brand_id  BIGINT       PRIMARY KEY AUTO_INCREMENT,
  name      VARCHAR(120) NOT NULL UNIQUE,
  logo_url  VARCHAR(512) NULL,
  is_active BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_brands_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS markets (
  market_id BIGINT       PRIMARY KEY AUTO_INCREMENT,
  season    VARCHAR(50)  NOT NULL,
  gender    ENUM('masculine','feminine','unisex','kids') NOT NULL,
  created_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_markets_season_gender (season, gender)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS retail_brands (
  retail_brand_id BIGINT    PRIMARY KEY AUTO_INCREMENT,
  brand_id  BIGINT          NOT NULL,
  store_url VARCHAR(512)    NULL,
  country   VARCHAR(80)     NULL,
  is_active BOOLEAN         NOT NULL DEFAULT TRUE,
  created_at DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_retail_brands_brand FOREIGN KEY (brand_id) REFERENCES brands(brand_id),
  INDEX idx_retail_brands_brand (brand_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
