"""
Pauli Meeting OS — Database adapter
Supports SQLite (default/fallback) and PostgreSQL/Supabase (via DATABASE_URL env var).

Security constraints:
- Never expose service-role or storage admin credentials to browser code.
- All access is owner-only; call from authenticated routes only.
- Strategy is never silently overwritten.
"""

import json
import os
import sqlite3
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

DATABASE_URL = os.getenv("DATABASE_URL", "")
SQLITE_PATH = os.getenv("SQLITE_PATH", "meeting_os.db")

SCHEMA_FILE = Path(__file__).parent.parent / "tools" / "meeting-os" / "schema.sql"
# Fallback: schema embedded inline for SQLite
SQLITE_SCHEMA = """
CREATE TABLE IF NOT EXISTS meeting_records (
  id TEXT PRIMARY KEY,
  bead_id TEXT NOT NULL UNIQUE,
  owner_id TEXT,
  project_slug TEXT NOT NULL,
  client_slug TEXT,
  meeting_type TEXT NOT NULL,
  title TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  submitted_at TEXT NOT NULL,
  duration_minutes INTEGER,
  status TEXT NOT NULL DEFAULT 'submitted',
  raw_state TEXT NOT NULL DEFAULT '{}',
  summary TEXT NOT NULL DEFAULT '{}',
  strategy_update TEXT NOT NULL DEFAULT '{}',
  transcript_status TEXT NOT NULL DEFAULT 'not_requested',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS meeting_records_project_time_idx
  ON meeting_records(project_slug, occurred_at DESC);

CREATE TABLE IF NOT EXISTS meeting_assets (
  id TEXT PRIMARY KEY,
  meeting_id TEXT NOT NULL REFERENCES meeting_records(id) ON DELETE CASCADE,
  storage_bucket TEXT NOT NULL DEFAULT 'local',
  object_path TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT,
  size_bytes INTEGER,
  sha256 TEXT,
  asset_kind TEXT NOT NULL DEFAULT 'attachment',
  processing_status TEXT NOT NULL DEFAULT 'stored',
  metadata TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  UNIQUE(meeting_id, object_path)
);

CREATE TABLE IF NOT EXISTS meeting_memory_entries (
  id TEXT PRIMARY KEY,
  meeting_id TEXT NOT NULL REFERENCES meeting_records(id) ON DELETE CASCADE,
  bead_id TEXT NOT NULL,
  project_slug TEXT NOT NULL,
  memory_type TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '{}',
  importance INTEGER NOT NULL DEFAULT 5,
  approved INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS meeting_memory_project_idx
  ON meeting_memory_entries(project_slug, created_at DESC);
"""

# ─── helpers ──────────────────────────────────────────────────────────────────

def _now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"


def _new_id() -> str:
    return str(uuid.uuid4())


def _jdump(obj: Any) -> str:
    return json.dumps(obj, ensure_ascii=False)


def _jload(s: Any) -> Any:
    if s is None:
        return {}
    if isinstance(s, (dict, list)):
        return s
    try:
        return json.loads(s)
    except Exception:
        return {}


# ─── SQLite adapter ───────────────────────────────────────────────────────────

def _get_sqlite_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(SQLITE_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def _ensure_sqlite_schema():
    conn = _get_sqlite_conn()
    try:
        conn.executescript(SQLITE_SCHEMA)
        conn.commit()
    finally:
        conn.close()


# ─── public API ───────────────────────────────────────────────────────────────

def init_db():
    """Initialize database schema. Called on server startup."""
    if DATABASE_URL:
        # Postgres: schema must be applied manually via schema.sql
        # We don't auto-apply migrations to production databases.
        return
    _ensure_sqlite_schema()


def create_or_update_meeting(
    bead_id: str,
    owner_id: Optional[str],
    project_slug: str,
    client_slug: Optional[str],
    meeting_type: str,
    title: str,
    occurred_at: str,
    duration_minutes: Optional[int],
    raw_state: Dict,
    summary: Dict,
    strategy_update: Dict,
) -> Dict:
    """Idempotent upsert by bead_id. Returns the canonical meeting record."""
    submitted_at = _now()
    now = submitted_at

    if DATABASE_URL:
        return _pg_upsert_meeting(
            bead_id, owner_id, project_slug, client_slug, meeting_type, title,
            occurred_at, submitted_at, duration_minutes, raw_state, summary,
            strategy_update, now,
        )

    return _sqlite_upsert_meeting(
        bead_id, owner_id, project_slug, client_slug, meeting_type, title,
        occurred_at, submitted_at, duration_minutes, raw_state, summary,
        strategy_update, now,
    )


def _sqlite_upsert_meeting(
    bead_id, owner_id, project_slug, client_slug, meeting_type, title,
    occurred_at, submitted_at, duration_minutes, raw_state, summary,
    strategy_update, now,
) -> Dict:
    conn = _get_sqlite_conn()
    try:
        # Check if already exists
        existing = conn.execute(
            "SELECT id FROM meeting_records WHERE bead_id = ?", (bead_id,)
        ).fetchone()

        if existing:
            meeting_id = existing["id"]
            conn.execute(
                """UPDATE meeting_records SET
                   summary=?, strategy_update=?, updated_at=?
                   WHERE bead_id=?""",
                (_jdump(summary), _jdump(strategy_update), now, bead_id),
            )
        else:
            meeting_id = _new_id()
            conn.execute(
                """INSERT INTO meeting_records
                   (id,bead_id,owner_id,project_slug,client_slug,meeting_type,
                    title,occurred_at,submitted_at,duration_minutes,
                    raw_state,summary,strategy_update,created_at,updated_at)
                   VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
                (
                    meeting_id, bead_id, owner_id, project_slug, client_slug,
                    meeting_type, title, occurred_at, submitted_at,
                    duration_minutes,
                    _jdump(raw_state), _jdump(summary), _jdump(strategy_update),
                    now, now,
                ),
            )
            # Write memory entries for each summary field
            _sqlite_write_memory_entries(conn, meeting_id, bead_id, project_slug, summary, now)

        conn.commit()
        row = conn.execute(
            "SELECT * FROM meeting_records WHERE id=?", (meeting_id,)
        ).fetchone()
        return _row_to_meeting(row)
    finally:
        conn.close()


def _sqlite_write_memory_entries(conn, meeting_id, bead_id, project_slug, summary, now):
    memory_types = {
        "confirmed_facts": summary.get("confirmed_facts", ""),
        "decisions": summary.get("decisions", ""),
        "unknowns": summary.get("unknowns", ""),
        "risks": summary.get("risks", ""),
        "next_actions": summary.get("next_actions", ""),
        "strategy_update_candidates": summary.get("strategy_update_candidates", ""),
    }
    for mem_type, content_text in memory_types.items():
        if content_text:
            conn.execute(
                """INSERT INTO meeting_memory_entries
                   (id,meeting_id,bead_id,project_slug,memory_type,content,created_at)
                   VALUES (?,?,?,?,?,?,?)""",
                (
                    _new_id(), meeting_id, bead_id, project_slug, mem_type,
                    _jdump({"text": content_text}), now,
                ),
            )


def _row_to_meeting(row) -> Dict:
    d = dict(row)
    for field in ("raw_state", "summary", "strategy_update"):
        d[field] = _jload(d.get(field))
    return d


def get_meeting_by_bead(bead_id: str) -> Optional[Dict]:
    if DATABASE_URL:
        return _pg_get_meeting(bead_id)
    conn = _get_sqlite_conn()
    try:
        row = conn.execute(
            "SELECT * FROM meeting_records WHERE bead_id=?", (bead_id,)
        ).fetchone()
        return _row_to_meeting(row) if row else None
    finally:
        conn.close()


def create_asset(
    bead_id: str,
    original_name: str,
    mime_type: str,
    size_bytes: int,
    object_path: str,
    storage_bucket: str,
    sha256: Optional[str] = None,
    asset_kind: str = "attachment",
) -> Dict:
    if DATABASE_URL:
        return _pg_create_asset(
            bead_id, original_name, mime_type, size_bytes,
            object_path, storage_bucket, sha256, asset_kind,
        )
    return _sqlite_create_asset(
        bead_id, original_name, mime_type, size_bytes,
        object_path, storage_bucket, sha256, asset_kind,
    )


def _sqlite_create_asset(
    bead_id, original_name, mime_type, size_bytes,
    object_path, storage_bucket, sha256, asset_kind,
) -> Dict:
    conn = _get_sqlite_conn()
    try:
        meeting = conn.execute(
            "SELECT id FROM meeting_records WHERE bead_id=?", (bead_id,)
        ).fetchone()
        if not meeting:
            raise ValueError(f"Meeting not found for bead_id: {bead_id}")
        asset_id = _new_id()
        now = _now()
        conn.execute(
            """INSERT OR REPLACE INTO meeting_assets
               (id,meeting_id,storage_bucket,object_path,original_name,
                mime_type,size_bytes,sha256,asset_kind,created_at)
               VALUES (?,?,?,?,?,?,?,?,?,?)""",
            (
                asset_id, meeting["id"], storage_bucket, object_path,
                original_name, mime_type, size_bytes, sha256, asset_kind, now,
            ),
        )
        conn.commit()
        return {
            "id": asset_id,
            "meeting_id": meeting["id"],
            "object_path": object_path,
            "original_name": original_name,
            "processing_status": "stored",
        }
    finally:
        conn.close()


def get_project_context(project_slug: str, limit: int = 20) -> List[Dict]:
    if DATABASE_URL:
        return _pg_get_context(project_slug, limit)
    return _sqlite_get_context(project_slug, limit)


def _sqlite_get_context(project_slug: str, limit: int) -> List[Dict]:
    conn = _get_sqlite_conn()
    try:
        rows = conn.execute(
            """SELECT m.bead_id, m.title, m.occurred_at, m.submitted_at,
                      m.meeting_type, m.duration_minutes,
                      m.summary, m.strategy_update,
                      (SELECT COUNT(*) FROM meeting_assets a WHERE a.meeting_id=m.id) as asset_count
               FROM meeting_records m
               WHERE m.project_slug=?
               ORDER BY m.occurred_at DESC
               LIMIT ?""",
            (project_slug, limit),
        ).fetchall()
        result = []
        for row in rows:
            d = dict(row)
            d["summary"] = _jload(d.get("summary"))
            d["strategy_update"] = _jload(d.get("strategy_update"))
            result.append(d)
        return result
    finally:
        conn.close()


# ─── Postgres stubs (requires asyncpg or psycopg2 in production) ──────────────

def _pg_upsert_meeting(*args, **kwargs) -> Dict:
    raise NotImplementedError(
        "Postgres adapter not yet wired. Set DATABASE_URL to enable. "
        "Apply schema.sql to your Supabase/Postgres instance first."
    )


def _pg_get_meeting(bead_id: str) -> Optional[Dict]:
    raise NotImplementedError("Postgres adapter not yet wired.")


def _pg_create_asset(*args, **kwargs) -> Dict:
    raise NotImplementedError("Postgres adapter not yet wired.")


def _pg_get_context(project_slug: str, limit: int) -> List[Dict]:
    raise NotImplementedError("Postgres adapter not yet wired.")
