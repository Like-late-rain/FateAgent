#!/usr/bin/env bash
set -euo pipefail

# Root directory of the repo
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "[setup] Missing dependency: $1" >&2
    return 1
  fi
}

log() {
  echo "[setup] $*"
}

cd "$ROOT_DIR"

log "Checking pnpm..."
if ! require_cmd pnpm; then
  echo "[setup] Please install pnpm first: https://pnpm.io/installation" >&2
  exit 1
fi

log "Installing dependencies with pnpm..."
pnpm install

log "Checking Python virtual environment..."
if [[ -n "${VIRTUAL_ENV:-}" ]]; then
  log "Using active virtual environment: ${VIRTUAL_ENV}"
else
  if [[ -d "apps/agent/.venv" ]]; then
    echo "[setup] Found apps/agent/.venv but it's not activated. Please activate it before running the agent." >&2
  else
    echo "[setup] No active Python virtual environment detected." >&2
    echo "[setup] Create one (example): python -m venv apps/agent/.venv" >&2
  fi
fi

log "Checking .env files..."
missing_env=false
if [[ ! -f "apps/web/.env.local" ]]; then
  echo "[setup] Missing apps/web/.env.local" >&2
  missing_env=true
fi
if [[ ! -f "apps/backend/.env" ]]; then
  echo "[setup] Missing apps/backend/.env (see apps/backend/.env.example)" >&2
  missing_env=true
fi
if [[ ! -f "apps/agent/.env" ]]; then
  echo "[setup] Missing apps/agent/.env" >&2
  missing_env=true
fi

if [[ "$missing_env" == true ]]; then
  echo "[setup] Please create the missing .env files before starting dev services." >&2
else
  log "All required .env files are present."
fi

log "Setup complete."
