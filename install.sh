#!/bin/sh

set -eu

REPO_ROOT=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
SKILLS_CLI_VERSION=${SKILLS_CLI_VERSION:-latest}

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
backup_and_link "$REPO_ROOT/.agents/skills" "$HOME/.agents/skills"
backup_and_link "$REPO_ROOT/.claude/skills" "$HOME/.claude/skills"

printf 'Installed and linked all skills.\n'
