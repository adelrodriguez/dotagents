# dotagents

This repo stores my coding-agent setup. It keeps skills, global instructions, and the list of installed third-party skills under version control, and [APM](https://github.com/microsoft/apm) installs them for Claude Code, Codex, OpenCode, and Grok.



The repo must be cloned to `~/.apm`. APM reads its user-scope manifest only from there and refuses a symlinked `~/.apm`.

## Installation

Installing needs [APM](https://github.com/microsoft/apm) and read access to the private [`adelrodriguez/private-skills`](https://github.com/adelrodriguez/private-skills) repo. APM uses your git credentials, so `gh auth login` is enough.

Clone the repo first. APM writes its own files to `~/.apm`, and `git clone` refuses a folder that isn't empty:

```sh
git clone https://github.com/adelrodriguez/dotagents.git ~/.apm
```

Install APM with Homebrew, on macOS or Linux:

```sh
brew install apm
```

On Linux without Homebrew, use APM's installer instead:

```sh
curl -sSL https://aka.ms/apm-unix | sh
```

Then sync:

```sh
make -C ~/.apm
```

`make` runs three commands:

1. `apm install --global` installs everything in `apm.lock.yaml`. If `apm.yml` and the lock disagree, it updates the lock to match, so check `git status` after a sync.
   - Skills go to `~/.claude/skills` for Claude Code and `~/.agents/skills` for Codex. OpenCode gets its own copy in `~/.config/opencode/skills`. Grok reads the Claude folder.
   - The skills in `skills/` are deployed from the working tree, so local edits apply on the next sync. APM installs only the ones listed in `apm.yml` by path.
   - Each file in `instructions/.apm/instructions/` goes to `~/.claude/rules/<name>.md`. Grok reads that folder too. Like the skills, they come from the working tree, so local edits apply on the next sync.
2. `apm prune` deletes packages in `apm_modules/` that `apm.yml` no longer lists. Global compile reads every instruction in `apm_modules/`, so a removed package's instructions would otherwise stay in `AGENTS.md`.
3. `apm compile --global` writes `~/.codex/AGENTS.md` and `~/.config/opencode/AGENTS.md` from the instructions package.
