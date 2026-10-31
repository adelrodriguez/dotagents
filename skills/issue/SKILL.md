---
name: issue
description: Use when creating or opening a GitHub issue, including tracker and child issues, or several issues at once.
---

# File an issue

Before filing, search open and closed issues for duplicates. Also check open PRs that may already fix the problem.

If a matching issue exists, return its link. If a closed issue describes a bug that has returned, file a new issue and link the old one. Update existing issues only when requested.

If an open PR already fixes the problem, return its link and any linked issue instead of filing a duplicate.

Check `.github/ISSUE_TEMPLATE/`, applicable `AGENTS.md` files, and the repository's issue-tracker documentation for guidance on templates, labels, types, and fields. Use the repository's documentation index or search its docs to find the issue-tracker guidance.

## Write the title

Follow the repository's title convention, using recent issues as examples. Name the affected behavior and the problem in plain language. Keep the title short enough to scan.

- Avoid: `Fix event propagation in the form`
- Prefer: `Clicking a form field opens the card's detail page`

## Write the description

Explain the user's problem first, using the report or evidence found. Describe why it matters.

For a bug, describe the observed and expected behavior without proposing a solution. You may include a suspected cause, clearly labeled as suspected.

- Avoid: `Call stopPropagation() in the form's click handler.`
- Prefer: `Clicking a field in the card's form also triggers the card's click handler. The detail page opens before the user can finish the form. Clicking a field should focus it and keep the form open.`

For a task, describe the work needed, the options considered, and the recommended option.

For a feature, describe the idea and proposal. If a feature or task requires multiple PRs, file a tracker issue first, then child issues. Use native parent-child relationships rather than checkboxes in the description.

For tasks and features, include a "Done when" section with observable acceptance criteria. State the behavior or result that proves the work is complete.

Use the terms defined in the repository's `GLOSSARY.md` when one exists.

Use the `unslop` skill to write the issue description.

## Include evidence

Check the current source or other direct evidence before stating that a bug exists. Separate confirmed facts from suspected causes and state what remains unverified.

For a bug, include the available evidence:

- Steps to reproduce or observe the problem.
- Relevant files and line numbers, linked as GitHub permalinks at the commit SHA you inspected, such as `https://github.com/<owner>/<repo>/blob/<sha>/<path>#L10-L20`.
- Error messages, stack traces, or command output.

For a visual problem, include a screenshot. When screenshots cannot capture the behavior, include a video.

Upload screenshots and videos with the `upload` skill and include them in the issue description. If an upload fails, state which attachment is missing.

## Set the issue metadata

Follow the repository's guidance when setting metadata:

- Set the issue type during creation with `gh issue create --type <type>`. For a bug, use `--type Bug`.
- Set the priority based on the impact on user experience, expected behavior, or security. For native issue fields, use the [issue field values API](https://docs.github.com/en/rest/issues/issue-field-values). Follow the repository's guidance for field IDs, allowed values, and payloads. If Priority is a project field, use the repository's project workflow.
- Apply the relevant labels with `gh issue create --label <label>` or `gh issue edit <number> --add-label <label>`.

## Submit the issue

End the description with the reported model and harness names:

> 🤖 **Created with <model> in <harness>**

Include the reported model and harness names of subagents that wrote part of the issue. Omit unavailable model names. Use the harness name only when the model name is unavailable.

Before submission, check the title, description, quotes, and attachments for secrets and private details.

Write the description to a file and pass it with `gh issue create --body-file <file>`, along with the title and applicable repository metadata. Preserve literal text and newlines. Do not pass the description inline with `--body`.

If `gh` is missing, ask the user to install it. If `gh` is not logged in, ask the user to run `gh auth login`.

If `gh issue create` fails because the GraphQL rate limit is used up, open it through REST with `gh api repos/<owner>/<repo>/issues -f title=... -F body=@<file>`. Use the same description file.

## Link related issues

After creating the issues, use the [sub-issues API](https://docs.github.com/en/rest/issues/sub-issues#add-sub-issue) to link each child to its parent:

```sh
gh api --method POST repos/<owner>/<repo>/issues/<parent-number>/sub_issues -F sub_issue_id=<child-id>
```

Get the child's numeric `id` with `gh api repos/<owner>/<repo>/issues/<child-number> --jq .id`. Use that `id` for `sub_issue_id`, not the issue number or GraphQL node ID.

If an issue is blocked by another issue, use the [issue dependencies API](https://docs.github.com/en/rest/issues/issue-dependencies#add-a-dependency-an-issue-is-blocked-by):

```sh
gh api --method POST repos/<owner>/<repo>/issues/<blocked-number>/dependencies/blocked_by -F issue_id=<blocking-id>
```

Use the blocking issue's numeric `id` for `issue_id`. The issue number in the path belongs to the blocked issue.

## Return the result

Read back the issue to verify its type, labels, priority, and relationships. State which requested settings could not be applied.

Return the issue URL. When filing several issues, return one list of links.
