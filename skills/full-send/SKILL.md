---
name: full-send
description: >-
  Take a task from first edit to merged PR with no user review: fix, verify,
  open a PR, drive CI and review bots to green, and merge. Use when the user
  says "full send", or hands off a task they never want to look at again.
---

# Full send

The user who sends a full-send task does **not** expect to read your output.
Treat the task as fully delegated: you own it from the first edit to the merge.
The full send itself is the user's permission to merge.

## Before you start

Check that it's safe to full-send. Stop and ask (see "Getting the user's
attention" below) instead of merging if any of these are true:

- The change could conflict with someone else's in-flight work (an open PR,
  a branch another person or agent is actively changing, or a migration
  in progress).
- It touches anything irreversible: data deletion, destructive migrations,
  billing, auth/permissions, secrets, or public API contracts.
- You cannot state what "done" means for this task in one sentence.

## The loop

1. **Fix it.** Make the change you were handed, and keep the diff to the
   task. Add tests only where the repo's standards call for them.
2. **Verify it yourself, for real.** Use whatever proves the change works:
   - Run the project's check, typecheck, lint, and format commands.
   - Actually use the thing. Run the CLI, open the page and click through the
     flow (computer use or browser automation), and hit the endpoint.
   - Write throwaway scripts if they help you confirm behaviour, and keep
     them out of the commit.
3. **Open a PR** with the `file-pr` skill. The evidence section carries
   what step 2 proved.
4. **Drive it to green** with the `monitor-pr` skill, until its watcher
   reports `DONE`. Rerun a flaky check once, and treat a second failure as
   real.
5. **Final confidence pass.** Re-read the full diff against the base. Done
   when every hunk traces to the task and step 2's verification passes on
   the final head commit.
6. **Merge if confidence is high.** Use the repo's normal merge method.
   Assume the user will never look at this again, so leave the repo in a
   state you'd be happy to hand to a stranger.
   If confidence is not high, leave the PR open with a short note on what's
   uncertain, and notify the user.

## Getting the user's attention

The user is not watching your output. If you truly need them (a decision
only they can make, a blocker, or a reason not to merge), **use the
ask-question / notification tool**, never a question buried in your text,
or they may never see it. Ask one specific question, with options.

## When you're done

Send one short notification: merged (with the PR link), or not merged and
why. Nothing else.
