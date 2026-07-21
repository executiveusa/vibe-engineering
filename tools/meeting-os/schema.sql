-- Pauli Meeting OS — PostgreSQL/Supabase-compatible schema
-- Apply only through the existing self-hosted database migration process.
-- SQLite version is auto-applied by server/meeting_os_db.py on first start.

CREATE TABLE IF NOT EXISTS meeting_records (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  bead_id       TEXT NOT NULL UNIQUE,
  owner_id      TEXT,
  project_slug  TEXT NOT NULL,
  client_slug   TEXT,
  meeting_type  TEXT NOT NULL,
  title         TEXT NOT NULL,
  occurred_at   TEXT NOT NULL,
  submitted_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  duration_minutes INTEGER,
  status        TEXT NOT NULL DEFAULT 'submitted',
  raw_state     TEXT NOT NULL DEFAULT '{}',
  summary       TEXT NOT NULL DEFAULT '{}',
  strategy_update TEXT NOT NULL DEFAULT '{}',
  transcript_status TEXT NOT NULL DEFAULT 'not_requested',
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX IF NOT EXISTS meeting_records_project_time_idx
  ON meeting_records(project_slug, occurred_at DESC);

CREATE TABLE IF NOT EXISTS meeting_assets (
  id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  meeting_id      TEXT NOT NULL REFERENCES meeting_records(id) ON DELETE CASCADE,
  storage_bucket  TEXT NOT NULL DEFAULT 'local',
  object_path     TEXT NOT NULL,
  original_name   TEXT NOT NULL,
  mime_type       TEXT,
  size_bytes      INTEGER,
  sha256          TEXT,
  asset_kind      TEXT NOT NULL DEFAULT 'attachment',
  processing_status TEXT NOT NULL DEFAULT 'stored',
  metadata        TEXT NOT NULL DEFAULT '{}',
  created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE(meeting_id, object_path)
);

CREATE TABLE IF NOT EXISTS meeting_memory_entries (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  meeting_id    TEXT NOT NULL REFERENCES meeting_records(id) ON DELETE CASCADE,
  bead_id       TEXT NOT NULL,
  project_slug  TEXT NOT NULL,
  memory_type   TEXT NOT NULL,
  content       TEXT NOT NULL DEFAULT '{}',
  importance    INTEGER NOT NULL DEFAULT 5 CHECK (importance BETWEEN 1 AND 10),
  approved      INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX IF NOT EXISTS meeting_memory_project_idx
  ON meeting_memory_entries(project_slug, created_at DESC);

-- Security requirement:
-- enforce owner-only access in the existing API/session layer;
-- never expose service-role credentials to browser code;
-- never create permissive anonymous write policies.
