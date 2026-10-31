---
name: file-issue
description: Use when creating or opening an issue.
---

# File an issue

Before filing, search open and closed issues for duplicates. If a matching issue exists, return its link. Update it only when requested.

Read the repository's guidance for issue templates, labels, types, and fields when it exists.

## Write the title

Follow the repository's title convention, using recent issues as examples. Name the affected behavior and the problem in plain language. Keep the title short enough to scan.

- Avoid: `Fix event propagation in the form`
- Prefer: `Clicking a form field opens the card's detail page`

## Write the description

Explain the user's problem first, using the report or evidence found. Describe why it matters.

For a bug, describe the observed and expected behavior. Keep the description focused on the problem rather than a proposed solution.

- Avoid: `Call stopPropagation() in the form's click handler.`
- Prefer: `Clicking a field in the card's form also triggers the card's click handler. The detail page opens before the user can finish the form. Clicking a field should focus it and keep the form open.`

For a task, describe the work needed, the options considered, and the recommended option.

For a feature, describe the idea and proposal. If a feature or task requires multiple PRs, file a tracker issue first, then child issues. Link them with parent-child relationships rather than checkboxes in the description.

Use the terms defined in the repository's `GLOSSARY.md` when one exists.

Use the `unslop` skill to write the issue description.

## Include evidence

Check the current source or other direct evidence before stating that a bug exists. Distinguish confirmed findings from suspected behavior and state what remains unverified.

For a bug, include the available evidence:

- Steps to reproduce or observe the problem.
- Relevant files and line numbers.
- Error messages, stack traces, or command output.

For a visual problem, include a screenshot. When screenshots cannot capture the behavior, include a video.

Upload screenshots and videos with the `upload-file` skill and include them in the issue description. If an upload fails, state which attachment is missing.

## Set the issue metadata

Follow the repository's guidance when setting metadata:

- Set the issue type to match the work. For a bug, use Bug.
- Set the priority based on the impact on user experience, expected behavior, or security.
- Apply the relevant labels from the repository's documentation.

## Submit the issue

End the description with the reported model and harness names:

> 🤖 **Created with <model> in <harness>**

Include the reported model and harness names of subagents that wrote part of the issue. Omit unavailable model names. Use the harness name only when the model name is unavailable.

Before submission, check the title, description, quotes, and attachments for secrets and private details.

Use `gh issue create` with the title, description, and applicable repository metadata. If `gh` is missing, install it. If `gh` is not logged in, ask the user to run `gh auth login`.
