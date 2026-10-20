#!/bin/sh

set -eu

REPO_ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)

if [ "$REPO_ROOT" != "$HOME/.apm" ]; then
  printf 'Error: clone this repo to %s/.apm. APM reads its user manifest only from there.\n' "$HOME" >&2
  exit 1
fi

command -v apm >/dev/null 2>&1 || {
  printf 'Error: APM is required. Install it with: uv tool install apm-cli\n' >&2
  exit 1
}

printf 'Installing locked skills and instructions...\n'
apm install --global --frozen

printf 'Compiling AGENTS.md for Codex and OpenCode...\n'
apm compile --global

printf 'Synced skills and instructions.\n'
