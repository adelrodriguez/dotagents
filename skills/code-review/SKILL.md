---
name: code-review
description: Use when the user or another skill explicitly invokes code-review or requests a "code-review loop" or "review loop". Generic requests to review code do not trigger this skill.
metadata:
  reference:
    - "https://github.com/t3dotgg/tstack/blob/main/skills/sol-loop/SKILL.md"
---

# Code review

Run this workflow only when the user or another skill explicitly invokes `code-review` or requests a "code-review loop" or "review loop".

Review code changes with an independent reviewer before or after filing a pull request. The reviewer finds issues. The main agent verifies findings, makes fixes, and returns evidence for another review.

Fix verified findings with the smallest necessary change. Keep the review within scope and challenge findings when the evidence does not support them.

## Defaults and overrides

- Use the agent tool's default Codex model unless the user names another model or provider. Resolve the available model at invocation time.
- Default to a maximum of three review rounds. If the user specifies a round limit, use it. Round 1 reviews the full change. Later rounds check only changed code and open findings.
- Use the agent tool's default effort and execution budget unless the user requests an override. Report unsupported overrides. The round limit is separate from any token or execution budget.
- If a round returns only nits, stop early. Declined nits and fixes limited to comments, documentation, or formatting need no new round.
- Keep one reviewer. The reviewer must not start subagents or reviewers.
- Track each finding's ID, severity, outcome, and reported usage. Never invent usage figures.

Examples:

- `/code-review`: default Codex model, three rounds, default budget.
- `/code-review Claude`: Claude reviewer, other defaults unchanged.
- `/code-review Claude, 5 rounds`: Claude reviewer, five-round limit.
- `/code-review 5 rounds, high effort`: default Codex model with overrides.

## Set the scope

Run `git status --short`. Do not stash, discard, or include unrelated changes. If you can separate the changed files from unrelated work, review only those files. Otherwise, stop and ask.

Find the base after `git fetch origin`:

- For a pull request, run `gh pr view <n> --json baseRefName,headRefOid`. If the working tree is clean, check out the branch. Confirm that `HEAD` matches the PR head or contains only additional commits for this change. Use `git merge-base HEAD origin/<baseRefName>` as the base.
- For local changes, use `git merge-base HEAD origin/<default-branch>`. Without a remote, use a base the user names, or `HEAD` to review only uncommitted changes.

Review the diff from the base to the working tree in the selected files, including untracked files. Use the same diff command in every round. State the intent and exclusions in one or two sentences. Run checks that cover the change, and fix failures caused by the change before requesting review. Note unavailable checks and existing failures in the review brief.

## Start the reviewer

Use the available subagent tools. If they support model selection, select the requested model. Do not hardcode model IDs.

If the agent tool cannot spawn the selected model, start a reviewer using the same model as the main agent. State the fallback and reason. If subagents are unavailable, report that the independent review cannot run. Do not present a self-review as an independent review.

Save the reviewer's identifier. If the tool supports follow-up messages, reuse the reviewer across rounds. Record the provider, model, and effort only when the tool reports them.

While the reviewer runs, leave the files under review unchanged. Use the tool's wait mechanism. A timeout, error, or missing reply is not approval. On failure, cancel the reviewer, verify that it has stopped, and restart with the findings and evidence collected so far. Keep only one reviewer active.

Give the reviewer a self-contained brief each round. Use this template for round 1:

```
Review only. Do not edit, commit, push, comment on PRs, or start subagents.
Repository: <absolute path>
Base: <sha>
Intent: <intent>
Out of scope: <scope>
Checks: <results>

Run `git diff <base> [-- <paths>]` and `git status --short`.
Read untracked files and the surrounding code. Find bugs, broken callers,
and behavior that differs from the intent.
Skip style issues unless they hide a bug. Recommend the smallest fix.
Flag code, tests, or guards that the intended behavior does not need.
Treat other code paths, rare cases, minor performance costs, and extra
compatibility as nits.

Use these severity labels:
- blocker: The intended case behaves incorrectly.
- should: Callers will encounter a real bug within scope.
- nit: Any other finding.
Reply:
VERDICT: APPROVE or CHANGES
S1 [blocker|should|nit] <file>:<line> <claim>. Fix: <suggestion>
Keep each finding's ID stable across rounds.
```

## Answer findings

Verify each finding and its severity. Treat other code paths, rare cases, and minor costs as nits, regardless of the reviewer's label.

- If you agree, make the smallest fix for the reported case. Prefer deleting or narrowing code over adding a lock, cache, helper, or option. When the intended behavior needs a test, add one focused test that fails without the fix.
- If you disagree, explain why with a file and line, a test, or command output.
- If the finding is out of scope or a nit, decline it in one sentence and list it as a follow-up.

Update the findings and evidence. Rerun checks and `git diff --shortstat <base>`. If the fixes enlarged the diff, look for code to remove before adding more. Do not accept a finding just to end the review.

## Continue the review

Start another round only while both the round limit and execution budget allow it. A new round requires at least one of these conditions:

- A blocker or should finding remains open.
- Code that affects behavior changed.
- The approval does not cover the current behavior diff.

If the tool supports follow-up messages, send the next brief to the saved reviewer. Otherwise, start a replacement with the same model selection. Include the round 1 brief, the findings and their outcomes and evidence, the same base diff, and the changes since the last round. Ask the reviewer to check only open findings and changed code. Mark each previous finding `resolved` or `still open: <reason>`.

## Stop and ship

The review is complete when the reviewer returns APPROVE for the current behavior diff, no blocker or should finding remains open, and you have no unresolved concerns.

Stop if a finding remains disputed after two replies or you reach the round limit or execution budget. For unresolved findings, summarize both sides in two or three lines each and let the user decide. Reaching a limit is not approval.

Do not push during the loop. Push after agreement only if the user asked to push, ship, or update the PR. If you push to a PR after approval, include:

`Reviewed with code-review: <N> rounds with <actual model>. Verdict: approved.`

If the tool reports the effort, add `on <effort>`.

Report the rounds used, actual model, any fallback and reason, checks, diff size before and after, fixed and declined findings with reasons, and whether you pushed. Include usage when the tool reports it, or state that usage is unavailable.
