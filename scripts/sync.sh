#!/bin/sh

set -eu

REPO_ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
SKILLS_CLI_VERSION=${SKILLS_CLI_VERSION:-latest}

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

"$REPO_ROOT/scripts/link.sh"

printf 'Synced locked skills and linked everything.\n'
