-- ChaseHorse CMS Schema Migration v2

CREATE TABLE IF NOT EXISTS cms_assets (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL,
  url TEXT NOT NULL,
  folder TEXT NOT NULL DEFAULT 'images',
  mime_type TEXT NOT NULL,
  filename TEXT NOT NULL,
  alt_text TEXT,
  size_bytes INTEGER DEFAULT 0,
  uploaded_by TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS cms_content (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  payload TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  updated_by TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS cms_revisions (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  payload TEXT NOT NULL,
  version INTEGER NOT NULL,
  updated_by TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_cms_assets_folder ON cms_assets(folder);
CREATE INDEX IF NOT EXISTS idx_cms_revisions_slug ON cms_revisions(slug);
