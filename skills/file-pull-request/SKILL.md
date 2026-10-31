---
name: file-pull-request
description: Use when the user asks to file, open, or create a pull request (PR).
metadata:
  reference:
    - "https://github.com/t3dotgg/tstack/blob/main/skills/file-pr/SKILL.md"
---

# File a pull request

Before filing, check whether a pull request for this branch already exists. If it does, return its link. Update it only when requested.

Review the diff locally against the base branch (usually `origin/main`) to make sure its contents match the goal. For a stacked PR, use the preceding PR's head branch as the base.

## Write the title

Follow the repository's title convention, using recently merged PRs as examples. If there is no convention, use conventional commits.

Prefer a concise, easy-to-understand title for a human reader that explains why the change matters:

- Avoid: `refactor(cli): share one definePayloadField helper for __proto__-safe payload writes`
- Prefer: `refactor(cli): guard against __proto__ payload keys in one place, not two`

## Write the description

Explain the user's problem first, then briefly describe the solution.

- Avoid: `Removed implicit workspace carryover from every new thread entry point. New threads inherit only the project from context; branch, worktree, audio…`
- Prefer: `My new worktree default was ignored when starting new threads on existing worktrees. Now your preference is always applied.`

When the PR fixes an issue, include `Closes #N`.

Use the terms defined in the repository's `GLOSSARY.md` when one exists.

Use the `unslop` skill to write the PR description.

## Include evidence

For new features with a visual result, include a screenshot. For changes to existing visuals or bug fixes, show before-and-after evidence. When screenshots cannot capture the behavior, include a video. For changes without a visual result, use command output or a regression test that fails before the fix and passes afterward. For documentation or refactors without behavior changes, describe the checks you ran.

Upload screenshots and videos with the `upload-file` skill and include them in the PR description, not the commit. If an upload fails, state which attachment is missing.

## Submit the PR

End the description with the reported model and harness names:

> 🤖 **Created with <model> in <harness>**

Include the reported model and harness names of subagents that wrote part of the change. Omit unavailable model names. Use the harness name only when the model name is unavailable.

Before submission, check the title, description, quotes, and attachments for secrets and private details.

Unless the user asks for a draft, open a ready-for-review PR so review bots run.

If `gh pr create` fails because the GraphQL rate limit is used up, open it through REST with `gh api repos/<owner>/<repo>/pulls -f title=... -f head=... -f base=... -F body=@<file>`.

If the user also asks to watch, monitor, or babysit the PR, use the `watch-pull-request` skill.

Post a follow-up PR comment only when requested or needed to complete the requested workflow. Use the `comment-on-pull-request` skill.
