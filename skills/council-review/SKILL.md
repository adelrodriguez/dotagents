---
name: council-review
description: Use when the user or another skill explicitly invokes council-review or requests a "council review" or "council review loop". Generic requests to review code do not trigger this skill.
metadata:
  reference:
    - "https://github.com/t3dotgg/tstack/blob/main/skills/council/SKILL.md"
---

# Council review

Read the `code-review` skill and follow its workflow, defaults, model fallback, finding rules, checks, and limits. Apply the differences below within that workflow. Do not start a separate code-review loop.

## Choose the reviewers

Use three independent reviewers by default. If the user specifies a reviewer count, use it. Each reviewer uses the model selected by `code-review` unless the user names several models or providers.

If the user names several models, assign one reviewer to each unless the user specifies a different count. When the count differs from the model list, distribute reviewers across that list in order.

For example, `/council-review Codex, Claude, Gemini, 5 rounds` uses one reviewer per named model with a five-round limit.

## Run each round

Replace the single reviewer with the council. Start each reviewer with a separate context and the same brief and version of the work. Run reviewers in parallel when supported, or in batches without sharing earlier responses. Keep the work unchanged until every reviewer responds.

Give findings a distinct prefix per reviewer, such as `C1-1` and `C2-1`. For code reviews, also request a score out of 10. Collect every response before comparing findings. Group duplicates while retaining their reviewer IDs, and verify evidence rather than counting votes.

One round includes a review from every council member. A missing response leaves the round incomplete. After fixes, send the updated work and finding outcomes to every reviewer. Approval requires every member to approve the current work. Scores do not replace verdicts.

For a proposal, replace the code diff with the document or question, constraints, and exclusions. Review revised sections and unresolved decisions in later rounds. Feedback does not authorize implementation.

## Report the council results

Use the report required by `code-review`, with the actual model and outcome for each reviewer. For code reviews, add a score table with one row per reviewer, columns for the reviewer number, full model name, and reasoning effort, and one column per round. Keep the reviewer number in its own column. If several reviewers use the same model, repeat the model name in separate rows. Write `no score` when a reviewer omits a score and `not completed` when a review is missing.

For example, a two-round council review could end with:

| # | Model | Reasoning effort | Round 1 | Round 2 |
| --- | --- | --- | --- | --- |
| 1 | gpt-6.1-sol | high | 7/10 | 9/10 |
| 2 | Claude Opus 5.5 | high | 8/10 | 9/10 |
| 3 | Grok 4.7 | xhigh | no score | 10/10 |

Use the full model names, reasoning efforts, and scores reported by the tools or reviewers. Write `unavailable` for model names or reasoning efforts that were not reported. Include only rounds that ran.

If a PR description update is authorized, replace the single-reviewer blurb with a `Council review` section before the model attribution. Include the rounds and score table. Otherwise, return the results in the reply. Do not post a PR comment for these results.

## Check the council

- Every member reviewed the same version independently.
- Duplicate findings retain their reviewer IDs.
- Every member approved the current work, or the report explains why the review stopped.
- Reported models, scores, and usage match the returned results.
