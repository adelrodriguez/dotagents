# Skill mechanics

This file covers what changes when the document is a skill: frontmatter, invocation, and router skills. Everything else about writing a skill is in [`SKILL.md`](SKILL.md).

## Choose who invokes the skill

The choice trades context load against cognitive load.

A **model-invoked** skill has a `description`, so the agent can load it on its own and other skills can load it. You can still invoke it by typing its name. The description is the skill's top-level context pointer, and it stays in context at all times. You pay that context load so the agent can find the skill. A model-invoked skill that holds only reference is also a good home for shared reference, because several skills can load it and the reference stays in one place. To make a skill model-invoked, omit `disable-model-invocation` and write the description for the model, with one trigger per branch. The pointer rules in `SKILL.md` apply in full.

A **user-invoked** skill hides its description from the agent. Only a human typing its name can invoke it, and no other skill can load it. It costs no context load, but it costs cognitive load, because you must remember that it exists. To make a skill user-invoked, set `disable-model-invocation: true`, and write the `description` as a one-line summary for humans, with no trigger list.

Make a skill model-invoked only when the agent or another skill must load it. If only you ever invoke it, make it user-invoked and pay no context load.

When two user-invoked skills need the same reference, neither skill can hold it, because neither can load the other. Put the reference in a plain file outside the skill system, which any skill can point to.

## Split by invocation

`SKILL.md` covers splitting by sequence. Split off a model-invoked skill when it has its own leading word that should trigger it, one you actually use in your prompts, or when another skill must load it. The new description adds context load on every turn, so the independent trigger must be worth that cost.

## Use a router skill when there are too many user-invoked skills

When you have more user-invoked skills than you can remember, write a **router skill**. A router skill is one user-invoked skill that lists the others and says when to use each, so you remember one skill instead of many. A router skill can only suggest the others. It cannot invoke them, because a user-invoked skill has no description that the agent can act on.
