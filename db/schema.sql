-- =============================================================================
-- Schema MySQL — SAI / Fashion AI (TCC 2026)
-- -----------------------------------------------------------------------------
-- Banco de dados principal da aplicação. Substitui o Firestore.
-- O Firebase passa a ser usado APENAS para autenticação / controle de acesso:
-- cada usuário do Firebase Auth é vinculado a uma linha em `users` pelo
-- campo `firebase_uid`.
--
-- Convenções:
--   * InnoDB + utf8mb4 (suporte a emoji e acentuação completa).
--   * Chaves primárias INT AUTO_INCREMENT; relações via FOREIGN KEY.
--   * Identidade do usuário externa (Firebase) em `users.firebase_uid`.
--   * Mapa de origem (coleção Firestore -> tabela) anotado em cada bloco.
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- users  <- coleção `saiUsers`
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  -- Ponte com o Firebase Auth (novo projeto). Identidade canônica externa.
  firebase_uid VARCHAR(128) NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  -- Legado: a autenticação migrou para o Firebase. Mantido NULL para contas
  -- antigas / fluxos locais; novas contas autenticam pelo Firebase Auth.
  password_hash VARCHAR(255) NULL,
  photo_url VARCHAR(512) NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  preferred_styles TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_firebase_uid (firebase_uid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- brands  <- coleção `saiBrands`
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS brands (
  brand_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  logo_url VARCHAR(512) NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- markets  <- coleção `saiMarkets`
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS markets (
  market_id INT AUTO_INCREMENT PRIMARY KEY,
  season VARCHAR(50) NOT NULL,
  gender VARCHAR(50) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- piece_items  <- coleção `saiPieceItems` (catálogo de peças por marca)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS piece_items (
  piece_item_id INT AUTO_INCREMENT PRIMARY KEY,
  brand_id INT NOT NULL,
  market_id INT NOT NULL,
  name VARCHAR(180) NOT NULL,
  image_url VARCHAR(512) NOT NULL,
  piece_type VARCHAR(80) NOT NULL,
  color VARCHAR(80) NOT NULL,
  material VARCHAR(80) NOT NULL,
  store_url VARCHAR(512) NULL,
  price_range VARCHAR(60) NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_piece_items_brand FOREIGN KEY (brand_id) REFERENCES brands(brand_id),
  CONSTRAINT fk_piece_items_market FOREIGN KEY (market_id) REFERENCES markets(market_id),
  INDEX idx_piece_items_brand (brand_id),
  INDEX idx_piece_items_market (market_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- wardrobe_items  <- coleção `saiWardrobeItems` (guarda-roupa do usuário)
-- Inclui os campos do pipeline 3D (ver db/firestore-schema.md).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wardrobe_items (
  wardrobe_item_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  brand_id INT NULL,
  market_id INT NULL,
  name VARCHAR(180) NOT NULL,
  image_url VARCHAR(512) NOT NULL,
  piece_type VARCHAR(80) NOT NULL,
  color VARCHAR(80) NOT NULL,
  material VARCHAR(80) NOT NULL,
  style_tags TEXT NULL,
  occasion_tags TEXT NULL,
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  -- Pipeline 3D
  model_status ENUM('queued_base','base_done','queued_branding','done','failed','needs_brand_review') NULL,
  model_base_3d_url VARCHAR(512) NULL,
  model_branded_3d_url VARCHAR(512) NULL,
  model_3d_url VARCHAR(512) NULL,
  model_preview_url VARCHAR(512) NULL,
  brand_id_selected INT NULL,
  brand_id_detected INT NULL,
  brand_detection_confidence DECIMAL(5,4) NULL,
  brand_detection_source VARCHAR(80) NULL,
  brand_applied BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_wardrobe_items_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_wardrobe_items_brand FOREIGN KEY (brand_id) REFERENCES brands(brand_id),
  CONSTRAINT fk_wardrobe_items_market FOREIGN KEY (market_id) REFERENCES markets(market_id),
  INDEX idx_wardrobe_items_user (user_id),
  INDEX idx_wardrobe_items_model_status (model_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- schemes  <- coleção `saiSchemes` (looks / outfits montados)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS schemes (
  scheme_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(180) NOT NULL,
  description TEXT NULL,
  creation_mode ENUM('manual','ai') NOT NULL,
  style VARCHAR(100) NOT NULL,
  occasion VARCHAR(100) NOT NULL,
  visibility ENUM('private','public') NOT NULL DEFAULT 'private',
  community_indexed BOOLEAN NOT NULL DEFAULT FALSE,
  cover_image_url VARCHAR(512) NULL,
  -- Publicação social / export (ver db/firestore-schema.md)
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  export_count INT NOT NULL DEFAULT 0,
  last_exported_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_schemes_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_schemes_user (user_id),
  INDEX idx_schemes_visibility (visibility, community_indexed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- scheme_items  <- subcoleção `saiSchemes/{id}/items` / `saiSchemeItems`
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS scheme_items (
  scheme_item_id INT AUTO_INCREMENT PRIMARY KEY,
  scheme_id INT NOT NULL,
  wardrobe_item_id INT NOT NULL,
  slot ENUM('upper','lower','shoes','accessory') NOT NULL,
  sort_order INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_scheme_items_scheme FOREIGN KEY (scheme_id) REFERENCES schemes(scheme_id) ON DELETE CASCADE,
  CONSTRAINT fk_scheme_items_wardrobe_item FOREIGN KEY (wardrobe_item_id) REFERENCES wardrobe_items(wardrobe_item_id),
  INDEX idx_scheme_items_scheme (scheme_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- user_saved_schemes  <- coleção `saiUserSavedSchemes`
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_saved_schemes (
  user_id INT NOT NULL,
  scheme_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, scheme_id),
  CONSTRAINT fk_saved_schemes_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_saved_schemes_scheme FOREIGN KEY (scheme_id) REFERENCES schemes(scheme_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- INTERAÇÕES SOCIAIS
-- Tabelas de junção normalizadas. Contagens (likes, médias) são obtidas via
-- COUNT()/AVG() em vez de documentos agregados como no Firestore.
-- =============================================================================

-- follows  <- coleção `saiFollows` (doc id: `${follower}_${following}`)
CREATE TABLE IF NOT EXISTS follows (
  follower_id INT NOT NULL,
  following_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (follower_id, following_id),
  CONSTRAINT fk_follows_follower FOREIGN KEY (follower_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_follows_following FOREIGN KEY (following_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT chk_follows_no_self CHECK (follower_id <> following_id),
  INDEX idx_follows_following (following_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- outfit_likes  <- coleção `saiOutfitLikes` (doc id: `${user}_${scheme}`)
CREATE TABLE IF NOT EXISTS outfit_likes (
  user_id INT NOT NULL,
  scheme_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, scheme_id),
  CONSTRAINT fk_outfit_likes_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_outfit_likes_scheme FOREIGN KEY (scheme_id) REFERENCES schemes(scheme_id) ON DELETE CASCADE,
  INDEX idx_outfit_likes_scheme (scheme_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- outfit_favorites  <- coleção `outfit_favorites` (doc id: `${user}_${scheme}`)
CREATE TABLE IF NOT EXISTS outfit_favorites (
  user_id INT NOT NULL,
  scheme_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, scheme_id),
  CONSTRAINT fk_outfit_favorites_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_outfit_favorites_scheme FOREIGN KEY (scheme_id) REFERENCES schemes(scheme_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- outfit_comments  <- coleção `saiOutfitComments`
CREATE TABLE IF NOT EXISTS outfit_comments (
  comment_id INT AUTO_INCREMENT PRIMARY KEY,
  scheme_id INT NOT NULL,
  user_id INT NOT NULL,
  content VARCHAR(500) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_outfit_comments_scheme FOREIGN KEY (scheme_id) REFERENCES schemes(scheme_id) ON DELETE CASCADE,
  CONSTRAINT fk_outfit_comments_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_outfit_comments_scheme (scheme_id, is_active, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- piece_likes  <- coleção `saiPieceLikes` (doc id: `${user}_${wardrobeItem}`)
CREATE TABLE IF NOT EXISTS piece_likes (
  user_id INT NOT NULL,
  wardrobe_item_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, wardrobe_item_id),
  CONSTRAINT fk_piece_likes_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_piece_likes_item FOREIGN KEY (wardrobe_item_id) REFERENCES wardrobe_items(wardrobe_item_id) ON DELETE CASCADE,
  INDEX idx_piece_likes_item (wardrobe_item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- piece_ratings  <- coleção `saiPieceRatings` (doc id: `${user}_${wardrobeItem}`)
-- A média/contagem (antiga `saiPieceStats`) é derivada via AVG()/COUNT().
CREATE TABLE IF NOT EXISTS piece_ratings (
  user_id INT NOT NULL,
  wardrobe_item_id INT NOT NULL,
  stars TINYINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, wardrobe_item_id),
  CONSTRAINT fk_piece_ratings_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_piece_ratings_item FOREIGN KEY (wardrobe_item_id) REFERENCES wardrobe_items(wardrobe_item_id) ON DELETE CASCADE,
  CONSTRAINT chk_piece_ratings_stars CHECK (stars BETWEEN 1 AND 5),
  INDEX idx_piece_ratings_item (wardrobe_item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- remixes  <- coleção `saiRemixes` (derivações de looks de outros usuários)
CREATE TABLE IF NOT EXISTS remixes (
  remix_id INT AUTO_INCREMENT PRIMARY KEY,
  source_scheme_id INT NOT NULL,
  remixed_scheme_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_remixes_source FOREIGN KEY (source_scheme_id) REFERENCES schemes(scheme_id) ON DELETE CASCADE,
  CONSTRAINT fk_remixes_remixed FOREIGN KEY (remixed_scheme_id) REFERENCES schemes(scheme_id) ON DELETE CASCADE,
  CONSTRAINT fk_remixes_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_remixes_source (source_scheme_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- notifications  <- coleção `saiNotifications`
CREATE TABLE IF NOT EXISTS notifications (
  notification_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type VARCHAR(60) NOT NULL,
  message VARCHAR(500) NULL,
  payload JSON NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_notifications_user (user_id, is_read, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- PIPELINE 3D / 2D (dress tester)
-- =============================================================================

-- pipeline_jobs  <- coleção `saiPipelineJobs` / `worker_jobs`
CREATE TABLE IF NOT EXISTS pipeline_jobs (
  job_id INT AUTO_INCREMENT PRIMARY KEY,
  wardrobe_item_id INT NULL,
  job_type VARCHAR(60) NOT NULL,
  status VARCHAR(60) NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  error_message TEXT NULL,
  payload JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_pipeline_jobs_item FOREIGN KEY (wardrobe_item_id) REFERENCES wardrobe_items(wardrobe_item_id) ON DELETE CASCADE,
  INDEX idx_pipeline_jobs_status (status, job_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- mannequins_2d  <- coleção `mannequin_2d`
CREATE TABLE IF NOT EXISTS mannequins_2d (
  mannequin_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  image_url VARCHAR(512) NOT NULL,
  gender VARCHAR(40) NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- wardrobe_pieces_2d  <- coleção `wardrobe_piece_2d`
CREATE TABLE IF NOT EXISTS wardrobe_pieces_2d (
  piece_2d_id INT AUTO_INCREMENT PRIMARY KEY,
  wardrobe_item_id INT NULL,
  name VARCHAR(180) NOT NULL,
  asset_url VARCHAR(512) NULL,
  asset_status ENUM('draft','asset_pending','asset_review','ready_for_tester','published') NOT NULL DEFAULT 'draft',
  render_layer INT NOT NULL DEFAULT 0,
  hides_piece_types VARCHAR(255) NULL,
  conflicts_with VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_pieces_2d_item FOREIGN KEY (wardrobe_item_id) REFERENCES wardrobe_items(wardrobe_item_id) ON DELETE SET NULL,
  INDEX idx_pieces_2d_status (asset_status, render_layer)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- outfit_selections  <- coleção `outfitSelections`
CREATE TABLE IF NOT EXISTS outfit_selections (
  selection_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  mannequin_id INT NULL,
  selection JSON NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_outfit_selections_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_outfit_selections_mannequin FOREIGN KEY (mannequin_id) REFERENCES mannequins_2d(mannequin_id) ON DELETE SET NULL,
  INDEX idx_outfit_selections_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- PUBLICAÇÃO SOCIAL / EXPORT
-- =============================================================================

-- user_posts  <- coleção `sai-userPosts`
CREATE TABLE IF NOT EXISTS user_posts (
  post_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  scheme_id INT NULL,
  status ENUM('draft','ready','exported','published','failed') NOT NULL DEFAULT 'draft',
  caption TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_posts_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_user_posts_scheme FOREIGN KEY (scheme_id) REFERENCES schemes(scheme_id) ON DELETE SET NULL,
  INDEX idx_user_posts_user (user_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- outfit_exports  <- coleção `sai-outfitExports`
CREATE TABLE IF NOT EXISTS outfit_exports (
  export_id INT AUTO_INCREMENT PRIMARY KEY,
  scheme_id INT NOT NULL,
  user_id INT NOT NULL,
  platform VARCHAR(60) NOT NULL,
  format VARCHAR(40) NOT NULL,
  asset_url VARCHAR(512) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_outfit_exports_scheme FOREIGN KEY (scheme_id) REFERENCES schemes(scheme_id) ON DELETE CASCADE,
  CONSTRAINT fk_outfit_exports_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_outfit_exports_scheme (scheme_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- AUTOPILOT DE LOOKS
-- =============================================================================

-- daily_looks  <- coleção `saiDailyLooks`
CREATE TABLE IF NOT EXISTS daily_looks (
  daily_look_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  look_date DATE NOT NULL,
  scheme_id INT NULL,
  weather_summary VARCHAR(255) NULL,
  payload JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_daily_looks_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_daily_looks_scheme FOREIGN KEY (scheme_id) REFERENCES schemes(scheme_id) ON DELETE SET NULL,
  UNIQUE KEY uq_daily_looks_user_date (user_id, look_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- outfit_preferences  <- coleção `saiOutfitPreferences` (1 por usuário)
CREATE TABLE IF NOT EXISTS outfit_preferences (
  user_id INT NOT NULL PRIMARY KEY,
  preferences JSON NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_outfit_preferences_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- week_plans  <- coleção `saiWeekPlans`
CREATE TABLE IF NOT EXISTS week_plans (
  week_plan_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  week_start DATE NOT NULL,
  payload JSON NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_week_plans_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  UNIQUE KEY uq_week_plans_user_week (user_id, week_start)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
