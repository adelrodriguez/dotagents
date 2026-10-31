---
description: Route bugs found during a task by scope and conflicts with the current changes.
applyTo: "**"
---

## Handle bugs

### Check the scope

If a bug is within the current scope of work, fix it and report the bug and fix to the user.

If a bug is outside the current scope, use the `issue` skill to file it and suggest another PR.

### Choose the PR for an out-of-scope fix

- If the fix will conflict with the current changes, suggest a stacked PR.
- If the fix will not conflict, suggest a sibling PR based on the current PR's base branch.

Continue the current task. Fix an out-of-scope bug only if the user asks.
