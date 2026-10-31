---
name: full-send
description: Use when the user says "full send" or "full submit".
metadata:
  reference:
    - "https://github.com/t3dotgg/tstack/blob/main/skills/full-send/SKILL.md"
---

# Full send

If the user triggers this, is because they are not watching this thread and they want you to complete the work on their behalf, end-to-end. Your updates and your final message will go unread, so you own the work from its current state to a merged PR.

If the user did not explictly request "full send" or "full submit" in a clear way, do not assume full autonomy. If they did, then everything below applies.

The user is granting you permission to:

- Merge the PR once the merge gate passes.
- Force-push the PR's own branch with `git push --force-with-lease` after a rebase.
- Rebase the PR and fix an conflicts.
- Use the test methods that the "Getting proof" section needs, without asking first.

## Testing permission

A "full send" request is the permission. If a project file or other instruction says to ask before a test method, or to leave the testing to the user, this request superseeds any such instructions for this task.

That includes ask-first rules for computer use, browser automation, simulators and devices, running the app or a dev server, screenshots, screen recordings and any other type of visual checks. Use the method that gives direct proof. List it in the report.

Rules about how to test still apply. Follow rules that name the correct comand, fixture or check. The permission only removes the ask-first or leave-it-to-the-user rule. If a preferred method cannot prove the change, use a gated method under this permission.

It only covers the test needed for this task. It does not add permission for steps under "When to ask the user", such as production changes or data deletion. It also does not bypass a harness or system approval prompt if one appears.

## Steps

1. **Finish the change.** Complete the goal from the user's request with the smallest change that works. Fix the case that happened, not every case that could happen. If you are on the default branch, create a branch first.
2. **Prove the change.**  Get proof for every change you made. See "Getting proof".
3. **Get feedback.** Use the `review-loop` skill to verify changes.
4. **File the pull request.** Use the `file-pull-request` skill. Rebase on the latest main branch before creating the PR.
5. **Watch the pull request.** Use the `watch-pull-request` skill to monitor the PR for feedback. Fix real findings and CI failures. Get proof of each fix before pushing.
6. **Merge the pull request** when the merge gate passes.
7. **Report it on your final message**. Report to the user the PR link, the merge commit, your proof and each decision made.

Stay active form step 1 to 7. If you end your turn while checks or bots are pending, the work stops because nobody will prompt you again. Wait with the watchers provided by `watch-pull-request`, so something wakes you when the pull request changes.

## Getting proof

Proof is evidence you observe yourself in this session: command output, a reproduction, a screenshot, or a screen recording.Use the most direct proof the change allow:

- Reproduce the original failure, apply the fix, then watch the same reproduction pass.
- Run the checks locally that the repo's CI runs (linting, formatting, typechecking, etc.)
- Add one focused the test that fails without the fix, when the behavior has none and the repo has a test setup.
- For UI and runtime behavior, run the app and look ath the change. Green mocked test do not prove that the user experience works. Attach screenshots or screen recordings to show the change using the `upload-file`skill.

## Merge ate

Full confidence means all of these are true on the latest commit:

- Your proof covers every change in the diff.
- Required checks are green.
- Review bots are finished, each finding is fixed or dismissed with a written reason, and they have given green light to the merge (varies by bot).
- No human review still request changes.
- The branch reports the branch as mergeable and it is not out of date with the base branch by more than 10 commits.

Merge with the method the repo uses. Check the allowed methods and recent merged PRs. If the repo uses a merge queue or auto-merge, stay until GitHub reports the Pr as merged. Merge through branch protection as configured. Never use any bypasses.

## Asking the user

A question in a normal message will go unseen by the user. The user no longer looks at the thread. If you want the attention of the user, use the harness' question tool so the thread shows is waiting for user input: `AskUserQuestion` in Claude Code, `request_user_input` in Codex, or whatever question tool your harness has. Put all the context in the question: PR link, what is blocking you, and the options, with your recommendation first.

Ask only when you cannot continue alone:

- You cannot prove the change.
- The merge gate cannot pass, and you cannot fix it yourself.
- The next step is outside of the grants above: deleting data, touching production, changing things outside the repo, touching sensitive data, closing a PR, force-pushing to any other branch.
- The goal is ambitious in a way that changes the result.
- Another PR has merged that makes this one obsolete.

Decide everything else yourself with sensible defaults. List thoe decision in the report.

If no question tool is available, or the tool returns no answer, take the safe path: leave the PR open and unmerged, and send your final message withh the expected communciation guidelines.
