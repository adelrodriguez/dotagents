---
name: monitor-pr
description: Monitor a pull request through review and CI. Use when the user asks to monitor, watch, or babysit a PR.
---

# Monitor PR

All the repos we work in have at least one AI review bot. They've given helpful but sometimes unreliable feedback. Your job is to drive the PR to green and approved by all the bots.

## Watching

Watch with `scripts/watch-pr.mjs`, next to this file. It is the shared watcher; reuse it instead of writing a polling loop, and pass several PRs to watch a stack in one process. `--help` lists the options.

```sh
node <skill-dir>/scripts/watch-pr.mjs [<pr> ...]
```

It blocks until a PR needs you, prints one digest that starts with `RESULT:`, and exits. Run it so you are woken when it exits: in the background if your harness notifies you about finished commands, otherwise in the foreground with the longest wait your shell tool allows and `--timeout` set just under that wait. Then act on the result:

- `ACTION`: handle every item in the digest. After you push, rerun with `--expect-head $(git rev-parse HEAD)` so the watcher ignores the old head's checks and reviews.
- `STALLED`: a review bot has gone quiet on the head commit. Follow the hint (usually an agent-marked `@bot review` comment), then rerun.
- `TIMEOUT` (exit code 2): nothing happened. Rerun the same command.
- `DONE` or `CLOSED`: report to the user.
- Exit code 1: read stderr, fix the cause (`gh auth status`, rate limits), and rerun.

The watcher remembers what it already reported, per PR, so each rerun shows only new items.

## Addressing feedback

- Mark comments as resolved if they are no longer relevant or have been addressed.
- Verify every bot finding against the source before changing code.
- Fix real findings and CI failures. Distinguish repository failures from infrastructure flakes.
- If a bot finding is a false positive or not worth addressing, reply with a written reason and resolve the comment.
- When the watcher reports `BASE MOVED` or `CONFLICT`, rebase so the PR stays fresh. Always rebase — never merge `main` in — and force-push with `--force-with-lease`.
- If an overlapping PR makes this one obsolete, stop monitoring, report to the user, and ask before closing — unless closure was explicitly authorized.

## Scope

Do not let review feedback expand the PR beyond the user's original goal. Address real shortcomings, but avoid scope creep.

## Commenting on the user's behalf

Never leave a comment from the user's account without indicating it came from an agent. Format comments left on Adel's behalf as:

> **`model-slug` (on behalf of Adel):**
>
> Actual reply.

The watcher relies on this marker to tell your replies apart from the user's own comments.

<!-- Disabled until startline is ready.

## Media

Screenshots and videos help reviews. Upload them with the startline-publish skill and embed the public URL in the PR. Don't fight GitHub's native upload.

-->

## Success criteria

Loop until the watcher reports `DONE`: CI green, every review bot approved on the head commit, no unresolved threads, and up to date with the base branch. Do not monitor or wait on human reviewers. Merge only when the user asked you to.
