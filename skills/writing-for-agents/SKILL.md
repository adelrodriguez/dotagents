---
name: writing-for-agents
description: Use when creating or editing skills, or modifying AGENTS.md or CLAUDE.md.
metadata:
  reference:
    - "https://github.com/mattpocock/skills/blob/main/skills/productivity/writing-for-agents/SKILL.md"
---

# Write for agents

Write documents that agents read, such as skills, `AGENTS.md`, `CLAUDE.md`, and the files they point to. The goal is that the agent follows the same process on every run. For documentation that people read, use the `writing-documentation` skill. For copy that ships in the product, use the `writing-for-humans` skill.

## Start from the repository

Before writing, read the agent documents near the one you are changing, the repository's `AGENTS.md`, and its `GLOSSARY.md` when it exists. Match their structure, headings, and terms. When an existing document already covers the behavior, edit it instead of adding a new one.

When the document is a skill, also read [`references/skill-mechanics.md`](references/skill-mechanics.md) for frontmatter, invocation, and router skills.

## Pick the type

An agent document follows the same four types as human documentation. Read the `writing-documentation` skill and the file for the type before you write.

- A skill or an `AGENTS.md` section that directs the agent to a result is a how-to guide. Write its steps as actions and decisions.
- A list of rules or facts that the agent looks up is reference. Describe only, and give every entry the same format.
- A reason belongs in one clause next to the rule it supports. Leave longer explanation out of agent documents.

Keep each file to one type. A short list of rules that the agent applies at one step can stay with that step. Move a long rule list or lookup table into its own reference file, and point to it from the step that uses it.

## Write the trigger

A skill's `description` and a line in `AGENTS.md` that names a file are both triggers. The agent reads the trigger on every turn and decides from its wording when to load the material. Write each trigger like this:

- Say what the material is, then list each distinct case that should load it. Write one trigger per case. Two synonyms for the same case count as one case.
- Put first the word that the user and the codebase actually use for the task.
- Leave out anything the body already says.

Every word of an always-loaded trigger costs tokens on every turn, so keep triggers shorter than any other text. When the agent skips material it needs, make the trigger more specific first. Move the material into the always-loaded file only if a sharper trigger does not fix it.

## Decide what stays in the main file

- Keep in the main file what every case needs. Move into a separate file what only some cases need, and point to it with a line that says when to read it.
- Keep a concept's definition, rules, and exceptions under one heading.
- When the main file is long even though every line is current, move reference into separate files and split the steps by case.

## End each step on a check

End every step on a condition that the agent can check, such as "every modified model is in the list" or "the command exits with code 0". With a vague condition such as "understand the code", the agent stops early so it can move on to the next step. A condition that requires every item, such as "every rule applied", also makes the agent do the reading and searching that the step needs, without a separate instruction for it.

If the agent still rushes a step with a clear condition, move the later steps where the agent cannot see them, such as into a subagent's prompt or a separate skill the agent runs afterward. An inline skill call does not hide the later steps, because they stay in the context.

End the document with a "Check the..." list, like the other skills in this repository.

## Choose the words

- Use the terms that the user, the codebase, and the other skills use. Give each concept one name and use it every time.
- Use plain, literal words. Define a term the first time it appears.
- When you forbid a pattern, give an example of it and the fix, as the `unslop` skill does.

## Prune every document

- Keep each rule in one place. When another skill already states a rule, point to that skill instead of repeating it.
- Leave out what the agent can find with one file read or one command, such as `package.json` scripts, config values, or `--help` output. Write down what the agent cannot find by looking: unwritten conventions, the reason for a choice, and pitfalls that no config file shows.
- Delete each sentence that no longer affects what the agent does, either because the behavior changed or because the model already does it by default. Delete the whole sentence rather than trimming words. When you cannot tell whether the model already does it, run the document without the sentence and compare.
- Apply the `restraint` skill before you add a line.

## Check the document

- The trigger lists each case once and puts the user's word first.
- Each file is one type, and the how-to points to each reference file from the step that uses it.
- Every step ends on a condition the agent can check.
- No rule appears in two places. Rules owned by another skill are pointers.
- Every file, command, script, and skill the document names exists.
- Use the `unslop` skill on the prose.

## Return the result

Return the document as it will ship. When you edit an existing document, list each moved, merged, or deleted section with its old and new location, in a table with "Before" and "After" columns. List each sentence you deleted as a duplicate or a default behavior.
