# Write a skill

Use this file when the agent document is a skill. It covers the frontmatter, who invokes the skill, and router skills. Everything else is in [`SKILL.md`](SKILL.md).

## Choose who invokes the skill

A **model-invoked** skill has a `description` that stays in the agent's context on every turn. The agent can load the skill on its own, other skills can load it, and the user can still invoke it by name. To make a skill model-invoked, omit `disable-model-invocation`, and write the `description` as a trigger, following "Write the trigger" in `SKILL.md`.

A **user-invoked** skill is loaded only when the user types its name. It costs no tokens until then, but the user must remember that it exists, and no other skill can load it. To make a skill user-invoked, set `disable-model-invocation: true`, and write the `description` as a one-line summary for people, with no list of cases.

Make a skill model-invoked only when the agent or another skill must load it on its own. Otherwise, make it user-invoked.

A model-invoked skill that holds only reference can share that reference between several skills. Two user-invoked skills cannot share reference this way, because neither can load the other. Put their shared reference in a plain file that both point to.

## Split off a new skill

Split part of a skill into a new model-invoked skill only when the user asks for that part on its own with a word they actually use, or when another skill must load it. Each new description costs tokens on every turn, so the separate trigger must be worth that cost. Otherwise, keep the part in the existing skill.

## Add a router skill

When there are more user-invoked skills than the user can remember, add a router skill. A router skill is one user-invoked skill that lists the others and says when to use each. It can only suggest the others, because a user-invoked skill cannot be loaded by anything except the user.

## Check the skill

- The frontmatter has `name` and `description`, and sets `disable-model-invocation: true` when the skill is user-invoked.
- A model-invoked `description` starts with "Use when" and lists each case once.
- A user-invoked `description` is a one-line summary.
