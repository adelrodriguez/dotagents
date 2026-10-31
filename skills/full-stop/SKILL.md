---
name: full-stop
description: Use when the user says "full stop".
metadata:
  reference:
    - "https://github.com/t3dotgg/tstack/blob/main/skills/full-stop/SKILL.md"
---

# Full stop

Follow the `full-send` workflow through PR readiness. An explicit "full stop" request grants its testing and branch permissions. These overrides apply.

## Keep the PR unmerged

Never merge, enable auto-merge, enter a merge queue, push to the default branch, bypass protection, or delegate those actions.

Before work and each push, disable existing auto-merge and remove the PR from any merge queue. Report those changes. If automatic merging cannot be prevented, stop and use `full-send`'s "Ask when blocked" instructions.

## Check readiness

Use `full-send`'s merge requirements as the readiness check. Verify the final diff, including conflict fixes.

Fetch the base and check the live PR state. Confirm the PR is open, ready for review, and cannot merge automatically.

## Hand off the PR

Stop watching the PR before handing it off or asking a question. Stop the `watch-pr` process or unregister the harness watcher, depending on which you used.

Report the PR URL, final head, evidence, review results, and remaining blockers. State whether it is ready, waiting only for human approval, or blocked, and confirm it remains open and unmerged. If someone else merged it, report that instead.
