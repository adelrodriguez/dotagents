---
name: watch-pull-request
description: Use when the user asks to watch, monitor, or babysit a pull request.
metadata:
  reference:
    - "https://github.com/t3dotgg/tstack/blob/main/skills/babysit-pr/SKILL.md"
---

# Watch a pull request

Wait for AI bot reviews and address their feedback until all checks pass.

## Start the watcher

Use the harness's watcher tool or, if none is available, the `watch-pr` script. Never write your own watcher, polling loop, or `sleep` loop.

Watch only PRs you own. If you are a delegated child task, leave the watcher to the parent thread that owns the PR. After each notification, check the merge requirements yourself.

Users cannot interact with a thread while it watches a PR, so stop the watcher before you finish, report readiness or a blocker, or ask for input. If a merge or closure does not stop the watcher automatically, stop it yourself.

If the watcher reports "Stopped watching, could not read it", run `gh api rate_limit --jq .resources.graphql` as one background command before restarting the watcher. Never retry in a tight loop.

### Use the `watch-pr` script

Run `scripts/pr-wait` from this skill's directory, using its absolute path:

```bash
pr-wait <pr> [--repo owner/name] [--until ready|green|any-change]
```

The script prints one line per event and returns one of these exit codes:

- `0`: the `--until` condition is met or the PR merges.
- `1`: action is needed because a required check failed, conflicts exist, review threads remain unresolved, or the PR closed.
- `2`: the input is invalid.

Choose the wait condition that matches the task:

- `ready` (default): wait for required checks to pass, Greptile or Macroscope to review the current head, and all review threads to be resolved.
- `green`: wait for required checks to pass. Use this when the repository has neither Greptile nor Macroscope.
- `any-change`: exit on the first event.

In Claude Code, run the script with the Monitor tool and `timeout_ms: 3600000` so each output line sends a notification. Without a monitor, run it as one long command that exits on its own.

Restart the script after a push, after you address an exit code of `1`, or when you resume work. The script tracks reported events and reports any that arrived while it was stopped.

If the script reports that another process already watches the PR, do not start a second watcher. Stop the existing process only if its events do not reach you.

With either watcher, end your turn without a message when an event needs no action. Never post or say "still waiting".

## Handle GitHub rate limits

`gh pr create`, `gh pr view`, and `gh pr checks` use GraphQL. If you reach the GraphQL limit, use REST, which has a separate limit:

- Read the PR with `gh api repos/<owner>/<repo>/pulls/<n>`.
- Read checks with `gh api repos/<owner>/<repo>/commits/<sha>/check-runs`.

## Address review feedback

Act only on checks and comments newer than the latest push. Verify each bot finding against the source before changing code.

Fix valid findings and CI failures, checking whether each failure comes from the repository or the infrastructure. When you dismiss a false positive, explain why in a comment.

If the repository contains `.macroscope/check-run-agents/*.md`, read those rules before replying to a Macroscope finding that cites them.

Evaluate CodeRabbit findings like other review findings, but do not wait for CodeRabbit or delay a merge for its review.

If you decide not to address a finding, explain why in a comment and resolve the thread. Use the `comment-on-pull-request` skill for every comment you post on the user's behalf. When screenshots or videos help explain the result, upload them with the `upload-file` skill.

Keep changes within the user's goal, and prefer fixes that delete or narrow code. Decline unrelated tests, unnecessary edge-case guards, extra integrations or compatibility work, and minor performance changes. Explain those decisions and list the declined work as follow-ups.

## Check the base branch and merge requirements

Check for changes to `main` and rebase when needed. `pr-wait` reports overlapping base commits and the `BEHIND` and `DIRTY` states. Because `watch_pull_request` reports only conflicts, check for `BEHIND` yourself before reporting that the PR is ready.

If another PR makes this PR obsolete, stop the watcher and report that to the user. Ask before closing the PR unless the user has already authorized closure.

Stop when `pr-wait` exits with code `0`, or when T3 Code's merge requirements pass for the latest head. Merge only when the user explicitly requests it. Otherwise, report that the PR is ready. If nothing has changed, stay quiet.

Immediately before merging, run `git fetch` and check the PR again. Never merge if the PR is `BEHIND` or `DIRTY`, or if base commits since the last successful check run touch its files. Rebase, push, and wait for checks to pass again.
