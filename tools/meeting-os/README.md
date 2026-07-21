# Pauli Meeting OS — Module

**Location:** `tools/meeting-os/` in `executiveusa/vibe-engineering`
**Version:** 0.2.0
**Status:** building → PREVIEW_READY

## Purpose

Turn calls, interviews, meetings, podcasts, and planning sessions into durable,
queryable operational memory.

```
brief → timed guided call → structured notes → evidence uploads →
summary → server timestamp + Bead → persistent memory →
agent context → Grill follow-up → proposed strategy changes → artifacts/tickets
```

## Access

Owner-only. Never expose to public routes. No client notes, recordings, private
addresses, strategy, or uploaded source material on public-facing paths.

## Running the frontend

Open `public/tools/meeting-os/index.html` in a browser, or access it through
the Vibe Engineering static site at `/tools/meeting-os/`.

The tool runs fully in-browser. Server submission is optional — local draft
recovery works without a server.

## Server backend

The FastAPI backend lives in `server/meeting_os.py`. It requires:

- A running Postgres/Supabase instance with `schema.sql` applied, **or**
- SQLite fallback (automatic if `DATABASE_URL` is not set)

### Environment variables

```
DATABASE_URL=postgresql://user:pass@host:5432/db   # Postgres — preferred
OBJECT_STORAGE_URL=                                # S3-compatible storage endpoint
OBJECT_STORAGE_BUCKET=pauli-meeting-os             # Bucket name
OBJECT_STORAGE_KEY=                                # Access key ID
OBJECT_STORAGE_SECRET=                             # Secret access key
MEETING_OS_OWNER_ID=                               # Optional fixed owner identifier
```

Never commit these values. Use `.env` excluded by `.gitignore`.

### Start server

```bash
cd server
uvicorn main:app --reload --port 8000
```

API available at `http://localhost:8000/api/meeting-os`

### Apply schema (Postgres/Supabase)

```bash
psql $DATABASE_URL -f tools/meeting-os/schema.sql
```

SQLite: schema is applied automatically on first server start.

## API endpoints

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/meeting-os/meetings` | Create/finalize meeting record (idempotent by bead_id) |
| `POST` | `/api/meeting-os/meetings/:bead_id/assets/presign` | Generate signed upload URL |
| `POST` | `/api/meeting-os/meetings/:bead_id/assets/complete` | Register completed asset upload |
| `GET` | `/api/meeting-os/context` | Agent memory query by project |
| `GET` | `/api/meeting-os/meetings/:bead_id` | Retrieve single meeting record |

See `contracts/api-contract.md` for full specification.

## Acceptance test coverage

See `ACCEPTANCE_EVIDENCE.md` for evidence against every acceptance test in
`tests/ACCEPTANCE_TESTS.md`.

## Templates

Meeting templates are data-driven JSON in `templates/`. The frontend loads them
at runtime. New templates can be added without modifying the app shell.

## Security constraints

- All endpoints require an authenticated server session (cookie or header).
- No service-role or storage admin credentials are ever sent to the browser.
- Large files use signed presigned URLs — never base64 in Postgres.
- Strategy is never silently overwritten. Submissions create proposals only.
- Bead IDs are idempotent — submitting the same bead twice is safe.
