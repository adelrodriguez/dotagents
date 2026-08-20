#!/bin/sh

set -eu

REPO_ROOT=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
SKILLS_CLI_VERSION=${SKILLS_CLI_VERSION:-latest}
ANIMATIONSDEV_TOKEN_REF=${ANIMATIONSDEV_TOKEN_REF:-op://Personal/animations.dev/token}
ANIMATIONSDEV_HOME=

cleanup() {
  if [ -n "$ANIMATIONSDEV_HOME" ] && [ -d "$ANIMATIONSDEV_HOME" ]; then
    rm -rf "$ANIMATIONSDEV_HOME"
  fi
}

trap cleanup EXIT
trap 'exit 1' HUP INT TERM

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

command -v node >/dev/null 2>&1 || {
  printf 'Error: Node.js is required.\n' >&2
  exit 1
}

command -v npx >/dev/null 2>&1 || {
  printf 'Error: npx is required.\n' >&2
  exit 1
}

cd "$REPO_ROOT"

printf 'Restoring project skills from skills-lock.json...\n'
npx --yes "skills@$SKILLS_CLI_VERSION" experimental_install

node -e '
  const fs = require("node:fs");
  const lock = require("./skills-lock.json");
  const missing = Object.keys(lock.skills).filter(
    (name) => !fs.existsSync(`.agents/skills/${name}/SKILL.md`),
  );

  if (missing.length > 0) {
    console.error(`Error: failed to restore ${missing.length} skill(s): ${missing.join(", ")}`);
    process.exit(1);
  }
'

backup_and_link "$REPO_ROOT/.agents/skills" "$REPO_ROOT/.claude/skills"

if [ -z "${ANIMATIONSDEV_TOKEN:-}" ]; then
  command -v op >/dev/null 2>&1 || {
    printf 'Error: set ANIMATIONSDEV_TOKEN or install the 1Password CLI.\n' >&2
    exit 1
  }

  ANIMATIONSDEV_TOKEN=$(op read "$ANIMATIONSDEV_TOKEN_REF") || {
    printf 'Error: could not read %s.\n' "$ANIMATIONSDEV_TOKEN_REF" >&2
    exit 1
  }
fi

# Limit agent detection to Claude so the project keeps one skills directory.
ANIMATIONSDEV_HOME=$(mktemp -d)
mkdir -p "$ANIMATIONSDEV_HOME/.claude"

printf 'Installing animations.dev skills into the project...\n'
HOME="$ANIMATIONSDEV_HOME" npx --yes @animationsdev/install \
  --token="$ANIMATIONSDEV_TOKEN" \
  --project \
  --yes

unset ANIMATIONSDEV_TOKEN
cleanup
ANIMATIONSDEV_HOME=

backup_and_link "$REPO_ROOT/.agents/skills" "$HOME/.agents/skills"
backup_and_link "$REPO_ROOT/.claude/skills" "$HOME/.claude/skills"

printf 'Installed and linked all skills.\n'
