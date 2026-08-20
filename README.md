# dotagents

This repo stores my coding-agent setup. It keeps skills, global instructions, and the list of installed third-party skills under version control.

The checked-in files have three roles:

- [`skills/`](skills/) contains skills maintained in this repo.
- [`skills-lock.json`](skills-lock.json) records every installed skill and its source.
- [`AGENTS.md`](AGENTS.md) and [`CLAUDE.md`](CLAUDE.md) hold global agent instructions.

Generated skill files do not belong in Git. The Skills CLI restores them into `.agents/skills`, and `.gitignore` excludes both `.agents/` and `.claude/`.

`install.sh` installs public and private skills. It does not copy or link the root instruction files.

## Installation

The installation entry point is `./install.sh`. The script works from any directory because it finds the repo root before it changes files.

The script then performs these steps:

1. `npx --yes skills@latest experimental_install` restores the skills in `skills-lock.json` to `.agents/skills`.
2. A Node.js check confirms that every locked skill has a `SKILL.md` file.
3. `.claude/skills` points to `.agents/skills` so both project paths use the same files.
4. The animations.dev installer adds private skills to the project through `.claude/skills`.
5. A temporary home directory limits the private installer to one project path. The script deletes that directory after installation.
6. `~/.agents/skills` points to this repo's `.agents/skills`.
7. `~/.claude/skills` points to this repo's `.claude/skills`.

If a target path contains a directory, the script moves that directory to a timestamped backup before it creates the symlink. A second run keeps correct symlinks in place.

The script requires Node.js and `npx`. It reads the animations.dev token from `ANIMATIONSDEV_TOKEN` when that variable is set. Otherwise, it reads `op://Personal/animations.dev/token` with the 1Password CLI.

Set `ANIMATIONSDEV_TOKEN_REF` to read a different 1Password item. Set `SKILLS_CLI_VERSION` to use a Skills CLI version other than `latest`:

```sh
ANIMATIONSDEV_TOKEN_REF=op://Personal/animations.dev/token \
  SKILLS_CLI_VERSION=1.5.23 \
  ./install.sh
```

## Skill changes

Files under `skills/` are the maintained source. Entries in `skills-lock.json` that point back to this repo restore the published GitHub version, not uncommitted files in the working tree.

The Skills CLI adds or updates third-party skills and writes the result to `skills-lock.json`. The lock file is the installed-skill list. The generated `.agents/skills` directory is only a local copy.

## Attribution

Some skills started in other repositories and were adapted here:

- [`architect`](https://github.com/cursor/plugins/blob/main/pstack/skills/architect/SKILL.md)
- [`arena`](https://github.com/cursor/plugins/blob/main/pstack/skills/arena/SKILL.md)
- [`bro`](https://github.com/cursor/plugins/blob/main/pstack/skills/bro/SKILL.md)
- [`create-verification-skill`](https://github.com/cursor/plugins/blob/main/pstack/skills/create-verification-skill/SKILL.md)
- [`how`](https://github.com/cursor/plugins/blob/main/pstack/skills/how/SKILL.md)
- [`interrogate`](https://github.com/cursor/plugins/blob/main/pstack/skills/interrogate/SKILL.md)
- [`maintain-verification-skill`](https://github.com/cursor/plugins/blob/main/pstack/skills/maintain-verification-skill/SKILL.md)
- [`no-comments`](https://github.com/cursor/plugins/blob/main/pstack/skills/no-comments/SKILL.md)
- [`show-me-your-work`](https://github.com/cursor/plugins/blob/main/pstack/skills/show-me-your-work/SKILL.md)

The animation skills come from [animations.dev skills](https://animations.dev/skills). They are installed separately and are not tracked in `skills/` or `skills-lock.json`.
