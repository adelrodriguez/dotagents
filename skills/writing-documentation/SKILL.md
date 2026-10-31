---
name: writing-documentation
description: Use when writing, editing, or reorganizing technical documentation for people, such as READMEs, docs sites, tutorials, how-to guides, API reference, and conceptual guides.
metadata:
  reference:
    - "https://diataxis.fr/"
    - "https://github.com/cursor/plugins/blob/main/pstack/skills/technical-writing/SKILL.md"
---

# Write documentation

Write documentation that serves one reader need per page. For documents that agents read, such as skills and `AGENTS.md`, use the `writing-for-agents` skill instead. For copy that ships in the product, use the `writing-for-humans` skill.

## Start from the docs

Before writing, read the existing docs around the page, the repository's `GLOSSARY.md`, and any docs style guide. Match their structure, terms, and tone.

Use only facts from the code, the product, or the user. Run commands and read the source before you describe them.

## Pick the type

Documentation serves a reader who practices a craft, such as using a library or running a service. That reader is either at study, acquiring the craft, or at work, applying it. The page either guides their action or informs their cognition. Those two questions give four types, and only four:

| The page...        | For a reader at study | For a reader at work |
| ------------------ | --------------------- | -------------------- |
| Guides action      | Tutorial              | How-to guide         |
| Informs cognition  | Explanation           | Reference            |

Each type answers a different question and takes a different form:

| Type         | Answers                | Form                  | Like                                   |
| ------------ | ---------------------- | --------------------- | -------------------------------------- |
| Tutorial     | "Can you teach me to…?" | A lesson              | Teaching a child to cook               |
| How-to guide | "How do I…?"           | A series of steps     | A recipe                               |
| Reference    | "What is…?"            | Dry description       | The label on a food packet             |
| Explanation  | "Why…?"                | Discursive discussion | A book on the history of cooking       |

Use the compass whenever the answer is not obvious, and also when it seems obvious but the writing feels hard. Ask the two questions of the reader's need, of the draft in front of you, and of single paragraphs and sentences. Intuition often gives a fast, wrong answer.

Then read the file for the type before you write:

- Tutorial: [`references/tutorial.md`](references/tutorial.md).
- How-to guide: [`references/how-to-guide.md`](references/how-to-guide.md).
- Reference: [`references/reference.md`](references/reference.md).
- Explanation: [`references/explanation.md`](references/explanation.md).

When you are improving or reorganizing existing docs rather than writing one new page, read [`references/improve.md`](references/improve.md) first.

## Keep the types apart

Each type blurs into its neighbors on the map, because neighbors share one axis:

- Tutorials and how-to guides both guide action. Mixing them is the most common and most harmful failure in software docs. A tutorial is for learning and a how-to guide is for getting work done, at any level of difficulty: a tutorial can teach an advanced skill, and a how-to guide can cover a basic chore.
- How-to guides and reference both serve work. Guides drift into listing every option; reference drifts into instructions.
- Reference and explanation both carry knowledge. Reference examples tend to grow into discussion of why.
- Tutorials and explanation both serve study. Tutorial authors who want the reader to understand pile in explanation.

When a sentence belongs to another type, move it to a page of that type and leave a link. Keep a one-line reason in a tutorial and link to the full explanation: "We use HTTPS because it is more secure." Link from a how-to guide to the reference for the full option list.

## Meet both kinds of quality

Functional quality is measured against the product: accuracy, completeness, consistency, precision, and usefulness. Each is separate, and a reader notices any lapse. Diátaxis does not supply it. Check it yourself against the source.

Deep quality is judged against the reader: the page has flow, fits the reader's need, anticipates the next thing they reach for, and feels good to use. It depends on functional quality, and the four types are how Diátaxis supports it. A page that stays in one type keeps its flow, because no digression interrupts the reader's purpose.

Sorting content by type also exposes functional gaps. Reference that mirrors the code shows which parts are undocumented. Moving explanation out of a tutorial shows where the reader was left to work something out alone. Report each gap you find.

## Check the docs

- Check each page against the checklist in its type's file.
- Check that each page is one type and that its title names that type's question.
- Check every command, example, and fact against the current source.
- Check the sentences against [`references/style.md`](references/style.md).
- Use the `unslop` skill on the prose.

## Return the result

Return the pages as they will ship. When you reorganize existing docs, list each moved or split section with its old and new location, in a table with "Before" and "After" columns. List the functional gaps you found and did not fix.
