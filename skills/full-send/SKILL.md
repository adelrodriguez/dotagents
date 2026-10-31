---
name: full-send
description: Use when the user says "full send" or "full submit".
metadata:
  reference:
    - "https://github.com/t3dotgg/tstack/blob/main/skills/full-send/SKILL.md"
---

# Full send

Use this workflow only when the user explicitly requests "full send" or "full submit". Complete the task from its current state through a merged PR without routine confirmation.

The user expects you to complete and merge the change yourself. They will not read this thread unless you call their attention through the question tool described under "Ask when blocked". Updates and final messages do not replace that notification.

The request authorizes you to merge once the merge requirements pass, rebase and resolve conflicts, and force-push the PR's own branch with `git push --force-with-lease`.

## Use the testing permission

A full-send request authorizes the testing needed for this task. It overrides project instructions that require asking first or leaving those tests to the user.

This permission covers computer use, browser automation, simulators, devices, app and dev-server runs, screenshots, and screen recordings. Use the method that provides direct evidence and name it in the final report.

Follow the repository's testing procedures, commands, and fixtures. If the preferred method cannot prove the change, use another method covered by this permission.

This permission does not cover production changes, data deletion, or the other actions listed under "Ask when blocked". System restrictions and harness approval requirements still apply.

## Finish the change

Complete the user's goal with the smallest change that works. Fix the reported case without expanding the task to hypothetical cases. If you are on the default branch, create a branch first.

## Prove the change

Use evidence you observe in this session, such as command output, a reproduction, a screenshot, or a screen recording.

Choose checks that prove the changed behavior:

- For a bug, reproduce the failure before the fix and verify that the same reproduction passes afterward.
- Run the relevant local CI checks, including linting, formatting, and type checking.
- If the behavior lacks coverage and the repository has a test setup, add a focused regression test that fails without the fix.
- For UI or runtime behavior, run the app and observe the result. Mocked tests alone do not prove the user experience. Upload screenshots or recordings with the `upload` skill.

## Review the change

Use the `code-review` skill to review the diff. Address valid findings and verify each fix before pushing.

## File the PR

Use the `pr` skill. Use the correct base branch for a stacked PR. Follow `monitor` for base updates and rebases.

## Watch the PR

Use the `monitor` skill to monitor checks and reviews. Fix valid findings and CI failures, and verify each fix before pushing. After each push, wait for fresh approval on the latest head.

Keep working until the PR merges or you reach a blocker that requires the user. While checks or reviews are pending, use the skill's watcher so notifications resume the work. End your turn only when the watcher can resume it.

## Merge the PR

Before merging, verify all of these conditions on the latest head:

- Your evidence covers every change in the diff.
- Required checks pass.
- Every required review agent approves under the repository's review gates.
- Every finding is fixed or declined with a written reason, and no review threads remain unresolved.
- No human review still requests changes.
- The PR is mergeable and meets the base-branch requirements in `monitor`.

Use the repository's merge method and follow `monitor` for stacks. Respect branch protection without bypasses. If the repository uses a merge queue or auto-merge, continue watching until GitHub reports the PR as merged.

## Ask when blocked

Use the harness's available question tool to call the user's attention when you need a decision. Include the PR link, the blocker, and the options, with your recommendation first.

Ask only when one of these conditions applies:

- You cannot prove the change.
- You cannot make the merge requirements pass.
- The next step requires permission beyond this request, such as deleting data, changing production, modifying files outside the repository, accessing sensitive data, closing a PR, or force-pushing another branch.
- Completing the goal requires a scope change that affects the result.
- Another merged PR makes this PR obsolete.

Decide routine details yourself and record material decisions in the final report.

If no question tool is available, leave the PR open and unmerged and report the blocker. If a required question has no answer, keep dependent work paused. An unanswered question does not grant permission.

## Report the result

Return the PR URL, merge commit, verification evidence, and material decisions. If the PR remains unmerged, state what blocks it.
