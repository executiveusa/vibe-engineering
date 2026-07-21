# Agent Context — Vibe Engineering

## Repository Purpose
Develop and prove the Vibe Engineering method, governance package, reference implementation, templates, and educational materials.

## Stack
- **Frontend:** React, Vite, GSAP
- **Database:** Local Supabase Postgres container database (reachable on port `54322` locally)
- **API Server:** Unified FastAPI API Server (located in `THE PAULI EFFECT/THE PAULI EFFECT/server/main.py`)

## Main Directories
- `src/` — Main React web interface source
- `public/` — Static assets (includes `tools/meeting-os/` path)
- `skills/` — Custom agent skills (includes `grill-me-meeting-adapter/`)
- `docs/` — Repository documentation

## Files Changed / Added
- Added `public/tools/meeting-os/index.html` (Meeting OS Frontend UI)
- Created `skills/grill-me-meeting-adapter/SKILL.md` (Grill follow-up skill registration)
- Added `THE PAULI EFFECT/THE PAULI EFFECT/server/meeting_os.py` (Backend router & uploads)
- Modified `THE PAULI EFFECT/THE PAULI EFFECT/server/main.py` (Includes router mount)

## Test & Build Commands
- Frontend checks: `npm run check` (runs tests and production build)
- Integration tests: Run python check script against local FastAPI uvicorn server.

## Next Recommended Steps
- Start the unified backend server to accept browser submissions.
- Launch the main React interface and navigate to `/tools/meeting-os/` to test live sessions.
