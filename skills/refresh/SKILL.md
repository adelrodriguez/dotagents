---
name: refresh
description: Use when the user says "refresh" or asks to rebase or update a pull request.
---

# Refresh a pull request

Bring a pull request up to date with its base branch, adapt it to what has merged since, and watch it until it is ready again.

A refresh request authorizes you to rebase the PR's own branch, resolve its conflicts, and force-push it. It does not authorize merging, closing the PR, or pushing any other branch.

Run each command in this skill on its own, and fill each `<placeholder>` with the value you recorded. Each command runs in a new shell, so shell variables do not carry over between commands.

## Find the PR

Use the PR the user names. When they name none, use the PR for the current branch with `gh pr view`.

When the PR's base is not the default branch, check for a stack with `gh stack view`. For a stack, follow "Work on a stacked PR" in the `monitor` skill for every rebase and push in this skill.

Read the PR's details:

```bash
gh pr view <pr> --json number,url,baseRefName,headRefName,headRefOid
```

Record `baseRefName` as `<base>`, `headRefName` as `<head-branch>`, and `headRefOid` as `<old-head>`. In a T3 worktree, the local branch often has a `t3/*` name that differs from `<head-branch>`. Always push to `<head-branch>`.

Fetch, then find the old merge base:

```bash
git fetch origin
```

```bash
git merge-base origin/<base> <old-head>
```

Record the result as `<old-base>`.

The step is done when you have recorded `<base>`, `<head-branch>`, `<old-head>`, and `<old-base>`.

## List what merged since

List the commits that reached the base branch after `old_base`, and the merged PRs they came from:

```bash
git log --oneline <old-base>..origin/<base>
```

```bash
git show -s --format=%cs <old-base>
```

Record the date as `<since>`, then list the merged PRs:

```bash
gh pr list --state merged --base <base> --search "merged:>=<since>"
```

Keep the commits and PRs that touch a file this PR changes, or a function, type, or config this PR uses.

The step is done when every commit in the range is either kept or ruled out.

## Check for overlap

Read each kept PR next to this PR's diff. Decide which case applies:

- **Same fix.** The other PR already fixes the problem this PR fixes, or delivers the same feature. Stop, and report it to the user. Ask before closing this PR, as the `monitor` skill says.
- **Partial overlap.** The other PR already does part of this PR. Plan to drop that part from this PR.
- **Changed dependency.** The other PR renamed, moved, or changed the behavior of code this PR relies on. Plan to adapt this PR to the new code.
- **No overlap.** The files are the same, but the changes are independent.

The step is done when every kept PR has one case.

## Rebase the branch

Rebase onto the updated base branch. Never merge the base branch in.

```bash
git rebase origin/<base>
```

Resolve each conflict by keeping the base branch's version of the code and reapplying this PR's change on top of it. Never undo a change that came from the base branch. Apply the plans from "Check for overlap" while you rebase.

The step is done when the rebase finishes and every overlap plan is applied.

## Verify the refreshed PR

Compare the old and new versions of the PR's commits:

```bash
git range-diff <old-base>..<old-head> origin/<base>..HEAD
```

Check that every difference comes from a conflict fix or an overlap plan, and that no change from the base branch was undone.

Run the repository's checks and tests. When the PR's description includes evidence such as a reproduction or a screenshot, repeat it on the new head.

The step is done when every difference in the range diff has a reason and the checks and tests pass.

## Push and update the PR

Push to the PR's head branch:

```bash
git push --force-with-lease origin HEAD:<head-branch>
```

When the refresh changed what the PR does, such as by dropping an overlapping part, update the PR description to match, following the `pr` skill.

The step is done when `gh pr view <pr> --json headRefOid` returns the same SHA as `git rev-parse HEAD`.

## Watch the PR

Use the `monitor` skill, starting the watcher with `--head $(git rev-parse HEAD)`. Merge only when the user asks.

The step is done when the `monitor` skill reports the PR ready, or reports a blocker.

## Check the refresh

- The branch was rebased, not merged.
- Every PR that merged since `old_base` and touches this PR's code has an overlap case.
- Every difference in the range diff comes from a conflict fix or an overlap plan.
- No change from the base branch was undone.
- The checks and tests pass on the new head.
- The push went to `<head-branch>`, and the PR's head on GitHub equals the local `HEAD`.
- The PR is watched until it is ready or blocked.

## Return the result

Return the PR URL, the new head SHA, and one bullet per overlapping PR with its case and what you changed. List the conflicts you resolved. End with the watcher's result.
