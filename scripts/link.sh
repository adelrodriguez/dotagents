#!/bin/sh

set -eu

REPO_ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)

backup_and_link() {
  source=$1
  destination=$2

  mkdir -p "$(dirname -- "$destination")"

  if [ -L "$destination" ]; then
    if [ "$(readlink "$destination")" = "$source" ]; then
      printf 'Already linked: %s -> %s\n' "$destination" "$source"
      return
    fi

    rm "$destination"
  elif [ -e "$destination" ]; then
    backup="${destination}.backup-$(date +%Y%m%d%H%M%S)-$$"
    mv "$destination" "$backup"
    printf 'Backed up: %s -> %s\n' "$destination" "$backup"
  fi

  ln -s "$source" "$destination"
  printf 'Linked: %s -> %s\n' "$destination" "$source"
}

backup_and_link "$REPO_ROOT/.agents/skills" "$REPO_ROOT/.claude/skills"
backup_and_link "$REPO_ROOT/.agents/skills" "$HOME/.agents/skills"
backup_and_link "$REPO_ROOT/.claude/skills" "$HOME/.claude/skills"

backup_and_link "$REPO_ROOT/AGENTS.md" "$HOME/.claude/CLAUDE.md"
backup_and_link "$REPO_ROOT/AGENTS.md" "$HOME/.codex/AGENTS.md"
backup_and_link "$REPO_ROOT/AGENTS.md" "$HOME/.config/opencode/AGENTS.md"
backup_and_link "$REPO_ROOT/AGENTS.md" "$HOME/.pi/agent/AGENTS.md"
