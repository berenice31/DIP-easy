-- =============================================================================
-- Schema SQL : création des tables pour DIP’Easy
-- =============================================================================

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- =============================================================================
-- 1. USERS : comptes et rôles
-- =============================================================================
CREATE TABLE users (
  id                    UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  email                 TEXT          NOT NULL UNIQUE,
  hashed_password       TEXT          NOT NULL,
  role                  TEXT          NOT NULL CHECK (role IN ('admin','editor','viewer')),
  two_factor_enabled    BOOLEAN       NOT NULL DEFAULT FALSE,
  is_active             BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ   NOT NULL DEFAULT now()
);


-- =============================================================================
-- 2. PRODUCTS : tous les champs “simples” du formulaire
-- =============================================================================
CREATE TABLE products (
  id                    UUID          PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Étape 1 : Informations produit
  nom_commercial        TEXT          NOT NULL,
  fournisseur           TEXT          NOT NULL,
  ref_formule           TEXT          NOT NULL,
  ref_produit           TEXT          NULL,
  date_mise_marche      DATE          NOT NULL,
  resp_mise_marche      TEXT          NOT NULL,
  faconnerie            TEXT          NOT NULL,

  -- Étape 3 : Caractéristiques physico-chimiques & PAO
  pc_ph                 NUMERIC(5,2)  NULL,
  pc_densite            NUMERIC(7,4)  NULL,
  pc_organoleptiques    TEXT          NULL,
  pao_theorique         TEXT          NULL,
  pao_valide            TEXT          NULL,

  -- Étape 6 : Utilisation normale
  util_descr            TEXT          NULL,
  util_precaution       TEXT          NULL,

  -- Étape 8 : Toxicologie (usage simple)
  tox_nanomaterials     BOOLEAN       NOT NULL DEFAULT FALSE,

  -- Étape 9 : Effets indésirables
  ei_signalements       TEXT          NULL,

  -- Étape 10 : Autres tests & effets revendiqués
  autres_tests          TEXT          NULL,
  effets_revendiques    TEXT          NULL,

  -- Audit
  created_at            TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ   NOT NULL DEFAULT now()
);
CREATE INDEX idx_products_ref_formule      ON products(ref_formule);
CREATE INDEX idx_products_date_mise_marche ON products(date_mise_marche);


-- =============================================================================
-- 3. INGREDIENTS : répétiteur “Formule quali-quantitative”
-- =============================================================================
CREATE TABLE ingredients (
  id               UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id       UUID      NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  ingr_nom_inci    TEXT      NOT NULL,
  ingr_fonction    TEXT      NOT NULL,
  ingr_pourcent_min NUMERIC  NULL,
  ingr_pourcent_max NUMERIC  NULL,
  ingr_cas         TEXT      NULL,
  ingr_provenance  TEXT      NULL,
  ingr_specif      TEXT      NULL
);
CREATE INDEX idx_ingredients_product ON ingredients(product_id);


-- =============================================================================
-- 4. STABILITY_TESTS : tests de stabilité
-- =============================================================================
CREATE TABLE stability_tests (
  id               UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id       UUID      NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  stab_temperature TEXT      NOT NULL,
  stab_duree       TEXT      NOT NULL,
  stab_observation TEXT      NULL,
  -- le rapport joint est stocké dans attachments (voir plus bas)
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_stability_tests_product ON stability_tests(product_id);


-- =============================================================================
-- 5. COMPATIBILITY_TESTS : tests de compatibilité emballage
-- =============================================================================
CREATE TABLE compatibility_tests (
  id               UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id       UUID      NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  comp_temp        TEXT      NOT NULL,
  comp_duree       TEXT      NOT NULL,
  -- rapport joint dans attachments
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_compatibility_tests_product ON compatibility_tests(product_id);


-- =============================================================================
-- 6. ATTACHMENTS : métadonnées des fichiers uploadés (Drive, etc.)
-- =============================================================================
CREATE TABLE attachments (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id       UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  field_key        TEXT        NOT NULL,      -- ex. dossier_fabrication, util_photo, stab_rapport…
  drive_file_id    TEXT        NOT NULL,      -- ID Google Drive
  file_name        TEXT        NOT NULL,
  mime_type        TEXT        NULL,
  url              TEXT        NULL,
  uploaded_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_attachments_product ON attachments(product_id);


-- =============================================================================
-- 7. TEMPLATES : modèles Word (.dotx/.docx) et style
-- =============================================================================
CREATE TABLE templates (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT        NOT NULL,
  version          TEXT        NOT NULL,
  drive_file_id    TEXT        NOT NULL,
  thumbnail_url    TEXT        NULL,
  toc              JSONB       NOT NULL DEFAULT '[]'::JSONB,
  style_config     JSONB       NOT NULL DEFAULT '{}'::JSONB,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(name, version)
);


-- =============================================================================
-- 8. GENERATIONS : jobs de création Word/PDF
-- =============================================================================
CREATE TABLE generations (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id       UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  template_id      UUID        NOT NULL REFERENCES templates(id),
  format           TEXT        NOT NULL CHECK (format IN ('docx','pdf')),
  drive_file_id    TEXT        NULL,
  status           TEXT        NOT NULL CHECK (status IN ('pending','success','error')),
  error_message    TEXT        NULL,
  initiated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at     TIMESTAMPTZ NULL
);
CREATE INDEX idx_generations_product ON generations(product_id);


-- =============================================================================
-- 9. TASKS : automatisations et rappels
-- =============================================================================
CREATE TABLE tasks (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT        NOT NULL,
  prompt           TEXT        NOT NULL,
  schedule         TEXT        NOT NULL,      -- RRULE iCal
  is_enabled       BOOLEAN     NOT NULL DEFAULT TRUE,
  next_run         TIMESTAMPTZ NULL,
  last_run         TIMESTAMPTZ NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- =============================================================================
-- 10. LOGS : traçabilité des événements
-- =============================================================================
CREATE TABLE logs (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type       TEXT        NOT NULL,
  entity_type      TEXT        NULL,
  entity_id        UUID        NULL,
  user_id          UUID        NULL REFERENCES users(id),
  level            TEXT        NOT NULL CHECK (level IN ('info','success','warning','error')),
  details          JSONB       NULL,
  timestamp        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_logs_timestamp ON logs(timestamp);


-- =============================================================================
-- 11. SETTINGS : clé/valeur pour configuration globale
-- =============================================================================
CREATE TABLE settings (
  key              TEXT        PRIMARY KEY,
  value            JSONB       NOT NULL,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
