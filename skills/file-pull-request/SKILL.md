---
name: file-pull-request
description: Use when the user asks to file, open, or create a pull request (PR).
---

# File Pull Request

Before filing, check whether a pull request for this branch already exists.

Review the diff locally against the base branch (usually `origin/main`) to make sure its content match the goal. When the user mentions a "stack", use the existing PR as the base for the new one.

## Titles

Titles for pull requests usually become commit messages, so follow the convention used in the repository. Look at recently merged PRs for examples. If no convention is specified, use conventional commits.

Prefer a concise, easy-to-understand title for a human reader that explains why the change matters:

- ❌ BAD: `refactor(cli): share one definePayloadField helper for __proto__-safe payload writes`
- ✅ GOOD: `refactor(cli): guard against __proto__ payload keys in one place, not two`

## Descriptions

Open the description with a simple explanation of what the problem is based on the user's original prompt, thenbriefly explain the solution. **Do not lead with an implementation inventory**.

- ❌ BAD: `Removed implicit workspace carryover from every new thread entry point. New threads inherit only the project from context; branch, worktree, audio…`
- ✅ GOOD: `My new worktree default was ignored when starting new threads on existing worktrees — super unintuitive. Now your preference is always applied."`

Use the terms defined in the repository's `GLOSSARY.md` when one exists.

## Evidence

Show that the change works with a before and after, and say how you verified it: the checks you ran and how you used the change (the page, the CLI, the endpoint). For a visual change, include the screenshots you took in the PR; do not leave them in a local folder or include them in the PR's changes. Use the `upload-file` skill to include screenshots. Otherwise use execution output: the command output that changed, or, when the PR adds a regression test, the test that failed before and passes now. A passing test is not proof by itself.

## Submitting

End the description with the public model name and harness that made the changes, for example:

> `Created with <model> in <harness>.`

Include subagent models that wrote part of the change. Use the model name the harness reports. If model identity is unavailable, name the harness without guessing a model.

Before submission, check the title, description, quotes, and attachments for secrets and private details.

Open a real PR rather than a draft so review bots run, unless the user asked to create a draft. If `gh pr create`  fails because the GraphQL rate limit is used up, open it through REST with `gh api repos/<owner>/<repo>/pulls -f title=... -f head=... -f base=... -F body=@<file>`. If the user also asked to watch, monitor or babysit it, use the `watch-pull-request` skill.

Do not post a follow-up PR comment unless it servers the user's request. When a comment is needed, use the `comment-on-pull-request` skill.
