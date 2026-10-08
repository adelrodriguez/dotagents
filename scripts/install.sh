#!/bin/sh

set -eu

REPO_ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)

if ! "$REPO_ROOT/scripts/sync.sh"; then
  printf 'Error: public skills sync failed. Rerun %s/scripts/sync.sh.\n' "$REPO_ROOT" >&2
  exit 1
fi

if ! "$REPO_ROOT/scripts/install-private-skills.sh"; then
  printf 'Error: private skills installation failed. Refresh credentials and rerun %s/scripts/install-private-skills.sh.\n' "$REPO_ROOT" >&2
  exit 1
fi

printf 'Installed and linked all skills.\n'
