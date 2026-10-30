---
name: watch-pull-request
description: Use when the user asks to watch, monitor, or babysit a pull request.
metadata:
  reference:
    - "https://github.com/t3dotgg/tstack/blob/main/skills/babysit-pr/SKILL.md"
---

# Watch a pull request

Address review agents' feedback until all required checks pass and every review agent approves the latest head.

## Start the watcher

Use the harness's watcher tool or, if none is available, the `watch-pr` script. Never write your own watcher, polling loop, or `sleep` loop.

Watch only PRs you own. If you are a delegated child task, leave the watcher to the parent thread that owns the PR. After each notification from the harness's watcher, check the merge requirements yourself.

Users cannot interact with a thread while it watches a PR, so stop the watcher before you finish, report readiness or a blocker, or ask for input. If a merge or closure does not stop the watcher automatically, stop it yourself.

If the harness's watcher reports "Stopped watching, could not read it", run `gh api rate_limit --jq .resources.graphql` as one background command before restarting the watcher. Never retry in a tight loop. `watch-pr` waits out rate limits on its own.

### Use the `watch-pr` script

Run `scripts/watch-pr` from this skill's directory, using its absolute path. `--help` lists every option.

```bash
watch-pr <pr> [--repo owner/name] [--until ready|green] [--head <sha>] [--require <agents>|none]
watch-pr show <pr>
```

The script prints one line per event and returns one of these exit codes:

- `0`: the `--until` condition is met or the PR merges.
- `1`: action is needed because a required check failed, the branch conflicts or is `BEHIND`, a review agent left findings or stalled, review threads remain unresolved, or the PR closed.
- `2`: the input is invalid, or another `watch-pr` already watches the PR.

Choose the wait condition that matches the task:

- `ready` (default): required checks pass, every review agent approves the latest head, no review threads remain unresolved, and the branch is mergeable.
- `green`: required checks pass.

Review agents are the review bots that engaged with this PR or with the repository's recent merged PRs. Pass `--require` to name them, or `--require none` when the repository has none.

Run `watch-pr show <pr>` to read the full text of every failed check, open finding, and unresolved thread.

If the harness provides a Monitor tool, run the script with `timeout_ms: 3600000` so each output line sends a notification. If the monitor stops before the script exits, restart the script. Without a monitor, run it as one long command that exits on its own.

After a push, restart the script with `--head $(git rev-parse HEAD)` so it ignores the old head. Also restart it after you address an exit code of `1`, or when you resume work. The script tracks reported events and reports any that arrived while it was stopped.

GitHub sometimes leaves the PR head on the old commit after a push. If the head has not moved after a few minutes, compare it with `gh api repos/<owner>/<repo>/pulls/<n> --jq .head.sha`, and push an empty commit to resync it.

If the script reports that another process already watches the PR, do not start a second watcher. Stop the existing process only if its events do not reach you.

With either watcher, end your turn without a message when an event needs no action. Never post or say "still waiting".

## Handle GitHub rate limits

`gh pr view` and `gh pr checks` use GraphQL. If you reach the GraphQL limit, use REST, which has a separate limit:

- Read the PR with `gh api repos/<owner>/<repo>/pulls/<n>`.
- Read checks with `gh api repos/<owner>/<repo>/commits/<sha>/check-runs`.

## Address review feedback

Act only on checks and comments newer than the latest push. Verify each bot finding against the source before changing code.

Verify approval for the latest head according to how each agent reports its review:

- **Agents that publish a review check.** Wait for the check to report approval. A completed check with unresolved findings is not approval.
- **Agents that leave comments.** Wait for a comment that reports no remaining issues or explicitly approves the change in the agent's own wording. Silence and resolved threads do not count as approval.

After each push, wait for fresh approval from every review agent. If a review does not restart automatically, use the retry command that `watch-pr` prints when it reports a stalled agent. Post the command with the `comment-on-pull-request` skill.

Use the bot's handle, which can differ from its product name:

- Bugbot: `@cursor review`.
- Greptile: `@greptileai review`.
- CodeRabbit: `@coderabbitai review`.

Fix valid findings and CI failures after checking whether each failure comes from the repository or the infrastructure.

If a finding cites repository review rules, read those rules before replying.

If you decide not to address a finding, explain why in a comment and resolve the thread. Use the `comment-on-pull-request` skill for every comment you post on the user's behalf. When screenshots or videos help explain the result, upload them with the `upload-file` skill.

Keep changes within the user's goal, and prefer fixes that delete or narrow code. Decline unrelated tests, unnecessary edge-case guards, extra integrations or compatibility work, and minor performance changes. Explain those decisions and list the declined work as follow-ups.

### Reply to and resolve review threads

Use the `watch-pr threads` commands for review threads, whichever watcher you run. Never write GraphQL for threads by hand.

```bash
watch-pr threads list <pr> [--json]
watch-pr threads reply <thread-id> --body-file <file> [--resolve]
watch-pr threads resolve <thread-id>...
```

- `list` prints each unresolved thread with its ID, location, and latest comments, and marks the threads you have already answered.
- `reply` posts the file's contents as a reply and prints its URL. It refuses a reply without the agent marker, so write the body with the `comment-on-pull-request` skill. Create the file with `mktemp`, because other sessions share fixed `/tmp` paths.
- `resolve` resolves every thread you pass in one request. Resolve threads once their fix is pushed or your reply explains why you declined.

## Work on a stacked PR

A PR whose base is not the default branch may be part of a GitHub stack, managed with the `gh stack` extension. Run `gh stack view` on the branch to see the stack, or `gh stack checkout <pr>` to import it.

- Watch every PR in the stack. Fix findings in the lowest PR that contains the code, because the PRs above inherit the fix.
- After you change a lower PR, run `gh stack sync`. It fetches, rebases each branch onto its updated parent, and pushes every branch at once with `--force-with-lease`. If it reports a conflict, run `gh stack rebase`, resolve the conflict, run `gh stack rebase --continue`, then `gh stack push`.
- For a stack of plain branches without `gh stack`, rebase each branch onto its parent from the bottom up, and push the bottom branch first with `--force-with-lease`.
- Never run `gh pr edit --base` on a stacked PR. It fails with "Cannot change the base branch because the pull request is part of a stack". Restructure the stack with `gh stack modify`. To split it, run `gh stack checkout <pr>` and then `gh stack unstack`, which removes only the grouping and leaves the PRs open. Ask the user before you restructure a stack.
- When you move a PR to the bottom of a stack, retarget it to the default branch before you force-push the branch that used to be its base. Otherwise GitHub can mark the PR as merged into that old base and delete its branch, and a merged PR cannot be reopened.
- Merge a stacked PR with `gh stack merge <pr>`, which merges it and every PR below it. `gh pr merge` fails on stacked PRs.

## Check the base branch and merge requirements

Rebase when `watch-pr` reports `DIRTY`, `BEHIND`, or base commits that touch this PR's files. Each rebase restarts CI and every review agent, so do not rebase only because the base moved. Because `watch_pull_request` reports only conflicts, check for `BEHIND` yourself before reporting that the PR is ready.

If another PR makes this PR obsolete, stop the watcher and report that to the user. Ask before closing the PR unless the user has already authorized closure.

Before reporting readiness, verify that required checks pass, every review agent approves the latest head, and no review threads remain unresolved. A `ready` exit from `watch-pr` establishes all three; any other watcher exit does not.

Stop the watcher once these conditions are met.

Merge only when the user explicitly requests it. Otherwise, report that the PR is ready.

If nothing has changed, stay quiet.

Immediately before merging, run `git fetch` and check the PR again. Never merge if the PR is `BEHIND` or `DIRTY`, or if base commits since the last successful check run touch its files. Rebase, push, and wait for checks to pass again.
