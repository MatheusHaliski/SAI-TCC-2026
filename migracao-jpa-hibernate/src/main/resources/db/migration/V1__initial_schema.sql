-- ============================================================
--  SAI Backend — Schema inicial (Flyway V1)
--  Banco: MySQL 8+
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  user_id       INT          AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  photo_url     VARCHAR(512) NULL,
  role          VARCHAR(50)  NOT NULL DEFAULT 'user',
  username      VARCHAR(80)  NULL UNIQUE,
  bio           TEXT         NULL,
  preferred_styles TEXT      NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS brands (
  brand_id   INT          AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(120) NOT NULL UNIQUE,
  logo_url   VARCHAR(512) NULL,
  is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS markets (
  market_id  INT         AUTO_INCREMENT PRIMARY KEY,
  season     VARCHAR(50) NOT NULL,
  gender     VARCHAR(50) NOT NULL,
  created_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS piece_items (
  piece_item_id INT          AUTO_INCREMENT PRIMARY KEY,
  brand_id      INT          NOT NULL,
  market_id     INT          NOT NULL,
  name          VARCHAR(180) NOT NULL,
  image_url     VARCHAR(512) NOT NULL,
  piece_type    VARCHAR(80)  NOT NULL,
  color         VARCHAR(80)  NOT NULL,
  material      VARCHAR(80)  NOT NULL,
  store_url     VARCHAR(512) NULL,
  price_range   VARCHAR(60)  NULL,
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_piece_items_brand   FOREIGN KEY (brand_id)  REFERENCES brands(brand_id),
  CONSTRAINT fk_piece_items_market  FOREIGN KEY (market_id) REFERENCES markets(market_id)
);

CREATE TABLE IF NOT EXISTS wardrobe_items (
  wardrobe_item_id          INT          AUTO_INCREMENT PRIMARY KEY,
  user_id                   INT          NOT NULL,
  brand_id                  INT          NOT NULL,
  market_id                 INT          NOT NULL,
  name                      VARCHAR(180) NOT NULL,
  image_url                 VARCHAR(512) NOT NULL,
  piece_type                VARCHAR(80)  NOT NULL,
  color                     VARCHAR(80)  NOT NULL,
  material                  VARCHAR(80)  NOT NULL,
  style_tags                TEXT         NULL,
  occasion_tags             TEXT         NULL,
  is_favorite               BOOLEAN      NOT NULL DEFAULT FALSE,
  -- 3D pipeline
  model_status              VARCHAR(40)  NULL,
  model_base_3d_url         VARCHAR(512) NULL,
  model_branded_3d_url      VARCHAR(512) NULL,
  model_3d_url              VARCHAR(512) NULL,
  model_preview_url         VARCHAR(512) NULL,
  brand_id_selected         VARCHAR(80)  NULL,
  brand_id_detected         VARCHAR(80)  NULL,
  brand_detection_confidence DOUBLE      NULL,
  brand_detection_source    VARCHAR(80)  NULL,
  brand_applied             BOOLEAN      NULL,
  placement_profile_id      VARCHAR(80)  NULL,
  branding_pass_version     INT          NULL,
  -- 2D tester
  asset_status              VARCHAR(40)  NULL,
  asset_2d_url              VARCHAR(512) NULL,
  created_at                DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at                DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_wardrobe_user   FOREIGN KEY (user_id)   REFERENCES users(user_id),
  CONSTRAINT fk_wardrobe_brand  FOREIGN KEY (brand_id)  REFERENCES brands(brand_id),
  CONSTRAINT fk_wardrobe_market FOREIGN KEY (market_id) REFERENCES markets(market_id)
);

CREATE TABLE IF NOT EXISTS schemes (
  scheme_id         INT          AUTO_INCREMENT PRIMARY KEY,
  user_id           INT          NOT NULL,
  title             VARCHAR(180) NOT NULL,
  description       TEXT         NULL,
  creation_mode     VARCHAR(10)  NOT NULL,
  style             VARCHAR(100) NOT NULL,
  occasion          VARCHAR(100) NOT NULL,
  visibility        VARCHAR(10)  NOT NULL DEFAULT 'private_v',
  community_indexed BOOLEAN      NOT NULL DEFAULT FALSE,
  cover_image_url   VARCHAR(512) NULL,
  created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_schemes_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS scheme_items (
  scheme_item_id   INT         AUTO_INCREMENT PRIMARY KEY,
  scheme_id        INT         NOT NULL,
  wardrobe_item_id INT         NOT NULL,
  slot             VARCHAR(20) NOT NULL,
  sort_order       INT         NOT NULL,
  created_at       DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_scheme_items_scheme  FOREIGN KEY (scheme_id)        REFERENCES schemes(scheme_id) ON DELETE CASCADE,
  CONSTRAINT fk_scheme_items_wi      FOREIGN KEY (wardrobe_item_id) REFERENCES wardrobe_items(wardrobe_item_id)
);

CREATE TABLE IF NOT EXISTS piece_likes (
  like_id          INT      AUTO_INCREMENT PRIMARY KEY,
  wardrobe_item_id INT      NOT NULL,
  user_id          INT      NOT NULL,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_piece_likes (wardrobe_item_id, user_id),
  CONSTRAINT fk_likes_wi   FOREIGN KEY (wardrobe_item_id) REFERENCES wardrobe_items(wardrobe_item_id),
  CONSTRAINT fk_likes_user FOREIGN KEY (user_id)          REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS piece_ratings (
  rating_id        INT      AUTO_INCREMENT PRIMARY KEY,
  wardrobe_item_id INT      NOT NULL,
  user_id          INT      NOT NULL,
  stars            TINYINT  NOT NULL,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_piece_ratings (wardrobe_item_id, user_id),
  CONSTRAINT fk_ratings_wi   FOREIGN KEY (wardrobe_item_id) REFERENCES wardrobe_items(wardrobe_item_id),
  CONSTRAINT fk_ratings_user FOREIGN KEY (user_id)          REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS outfit_favorites (
  favorite_id INT      AUTO_INCREMENT PRIMARY KEY,
  user_id     INT      NOT NULL,
  scheme_id   INT      NOT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_outfit_favorites (user_id, scheme_id),
  CONSTRAINT fk_fav_user   FOREIGN KEY (user_id)   REFERENCES users(user_id),
  CONSTRAINT fk_fav_scheme FOREIGN KEY (scheme_id) REFERENCES schemes(scheme_id)
);

CREATE TABLE IF NOT EXISTS outfit_exports (
  export_id       INT          AUTO_INCREMENT PRIMARY KEY,
  user_id         INT          NOT NULL,
  outfit_id       VARCHAR(100) NULL,
  scheme_id       INT          NULL,
  platform        VARCHAR(60)  NOT NULL,
  format          VARCHAR(40)  NOT NULL,
  export_mode     VARCHAR(40)  NULL,
  status          VARCHAR(40)  NOT NULL DEFAULT 'pending',
  caption         TEXT         NULL,
  source_image_url VARCHAR(512) NULL,
  result_url      VARCHAR(512) NULL,
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_exports_user   FOREIGN KEY (user_id)   REFERENCES users(user_id),
  CONSTRAINT fk_exports_scheme FOREIGN KEY (scheme_id) REFERENCES schemes(scheme_id)
);

CREATE TABLE IF NOT EXISTS user_posts (
  post_id          INT          AUTO_INCREMENT PRIMARY KEY,
  user_id          INT          NOT NULL,
  outfit_id        VARCHAR(100) NULL,
  scheme_id        INT          NULL,
  title            VARCHAR(180) NOT NULL,
  caption          TEXT         NULL,
  platforms        TEXT         NULL,
  primary_platform VARCHAR(60)  NULL,
  visibility       VARCHAR(20)  NOT NULL DEFAULT 'private',
  preview_image_url VARCHAR(512) NULL,
  status           VARCHAR(40)  NOT NULL DEFAULT 'draft',
  created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_posts_user   FOREIGN KEY (user_id)   REFERENCES users(user_id),
  CONSTRAINT fk_posts_scheme FOREIGN KEY (scheme_id) REFERENCES schemes(scheme_id)
);

CREATE TABLE IF NOT EXISTS daily_looks (
  daily_look_id INT         AUTO_INCREMENT PRIMARY KEY,
  user_id       INT         NOT NULL,
  scheme_id     INT         NULL,
  occasion      VARCHAR(100) NULL,
  mood          VARCHAR(80)  NULL,
  weather_c     DOUBLE       NULL,
  feedback      VARCHAR(20)  NULL,
  confirmed     BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_daily_user   FOREIGN KEY (user_id)   REFERENCES users(user_id),
  CONSTRAINT fk_daily_scheme FOREIGN KEY (scheme_id) REFERENCES schemes(scheme_id)
);

CREATE TABLE IF NOT EXISTS pipeline_jobs (
  job_id           INT          AUTO_INCREMENT PRIMARY KEY,
  wardrobe_item_id INT          NOT NULL,
  job_type         VARCHAR(60)  NOT NULL,
  provider         VARCHAR(40)  NULL,
  status           VARCHAR(40)  NOT NULL DEFAULT 'queued',
  runpod_job_id    VARCHAR(120) NULL,
  result_url       VARCHAR(512) NULL,
  error            TEXT         NULL,
  created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_jobs_wi FOREIGN KEY (wardrobe_item_id) REFERENCES wardrobe_items(wardrobe_item_id)
);
