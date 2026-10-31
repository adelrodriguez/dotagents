---
name: consistency
description: Use when the user says "consistency" or asks to apply a pattern across the codebase or a scope.
---

# Apply a pattern consistently

Apply a pattern the user built in one place to every other place in the scope where it belongs. A site is one place in the code that follows the old pattern.

## State the pattern

Read the code the user points to. When they point to nothing, read the uncommitted diff and the last few commits.

Write the pattern as one rule, with a before-and-after example taken from that code. When the code supports more than one rule, ask the user which one they mean.

When the rule conflicts with the repository's `AGENTS.md` or `CODING_STANDARDS.md`, report the conflict and ask which one to follow.

The step is done when you have one rule, an example, and an answer to every question you asked.

## Set the scope

Use the folders, files, or modules the user names. When they name none, use the whole repository.

The step is done when the scope is a list of paths.

## Find the sites

Search the scope by code structure as well as by text, because the old pattern rarely looks the same at every site. Use `ast-grep` when it is installed, and `grep` otherwise.

Put each match in one of these groups:

- **Change.** The site follows the old pattern, and the rule fits it as written.
- **Adapt.** The rule fits only with an extra change, such as a new parameter.
- **Skip.** The site looks similar but differs in a way that matters, such as different behavior or a different caller.
- **Design.** Changing the site would remove or alter a public API or change the folder organization. Leave it out of this change and propose it with the `codebase-design` skill.

The step is done when every match is in exactly one group.

## Show the dry run

Show the rule and its example, then one short bullet list per group. Give each adapted site the change it needs, and give each skipped site a one-line reason.

When fewer than five files will change, continue without waiting. Otherwise, wait for the user's agreement.

The step is done when fewer than five files will change, or when the user agrees.

## Apply the rule

Apply the rule to the change and adapt groups. Keep each site's behavior the same.

Run the repository's checks and tests. When a site fails, fix it within the rule, or move it to the skip group with a reason.

The step is done when the checks and tests pass.

## Enforce the pattern

Propose one way to keep the old pattern from coming back. Prefer the first option that the repository's tooling supports:

1. A lint rule, such as an `ast-grep` rule or a rule in the repository's linter, that rejects the old pattern.
2. A test that fails on the old pattern.
3. A line in the repository's `AGENTS.md` that states the rule and points to an example.

Add it only when the user agrees.

The step is done when the user has accepted or declined the proposal.

## Check the changes

- The rule and its example were written before any file changed.
- Every match in the scope is in exactly one group.
- No site's behavior changed.
- The checks and tests pass.
- Design sites were proposed with `codebase-design`, not changed.

## Return the result

Return the rule, then one bullet list per group, with the reason for each skipped site. End with the proposal for enforcing the pattern.
