#!/usr/bin/env bash
set -euo pipefail

# Root directory of the repo
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

PIDS=()
NAMES=()

log() {
  echo "[dev] $*"
}

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "[dev] Missing dependency: $1" >&2
    return 1
  fi
}

start_service() {
  local name="$1"
  local dir="$2"
  shift 2

  if [[ ! -d "$ROOT_DIR/$dir" ]]; then
    echo "[dev] Directory not found: $dir" >&2
    return 1
  fi

  (cd "$ROOT_DIR/$dir" && "$@") &
  local pid=$!
  PIDS+=("$pid")
  NAMES+=("$name")
  log "Started $name (pid $pid)"
}

stop_services() {
  local reason="$1"
  log "$reason"

  for pid in "${PIDS[@]}"; do
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid" 2>/dev/null || true
    fi
  done

  local exit_code=0
  for i in "${!PIDS[@]}"; do
    local pid="${PIDS[$i]}"
    if wait "$pid" 2>/dev/null; then
      true
    else
      local status=$?
      if [[ $exit_code -eq 0 ]]; then
        exit_code=$status
      fi
      log "Service ${NAMES[$i]} exited with status $status"
    fi
  done

  return "$exit_code"
}

on_interrupt() {
  stop_services "Received interrupt. Stopping services..."
  exit 130
}

trap on_interrupt INT TERM

log "Checking dependencies..."
if ! require_cmd pnpm; then
  echo "[dev] Please install pnpm first: https://pnpm.io/installation" >&2
  exit 1
fi

log "Starting services..."
if ! start_service "web" "apps/web" env PORT=3000 pnpm dev; then
  stop_services "Failed to start web service."
  exit 1
fi
if ! start_service "backend" "apps/backend" env PORT=3001 pnpm dev; then
  stop_services "Failed to start backend service."
  exit 1
fi
if ! start_service "agent-ts" "apps/agent-ts" pnpm dev; then
  stop_services "Failed to start agent-ts service."
  exit 1
fi

log "All services started. Press Ctrl+C to stop."

while true; do
  for i in "${!PIDS[@]}"; do
    pid="${PIDS[$i]}"
    if ! kill -0 "$pid" 2>/dev/null; then
      stop_services "Service ${NAMES[$i]} stopped. Stopping others..."
      exit $?
    fi
  done
  sleep 1
done
