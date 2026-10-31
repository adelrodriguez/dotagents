---
name: writing-for-agents
description: Use when creating or editing skills, or modifying AGENTS.md or CLAUDE.md.
metadata:
  reference:
    - "https://github.com/mattpocock/skills/blob/main/skills/productivity/writing-for-agents/SKILL.md"
---

This is the reference for any document an agent reads, such as a skill, an `AGENTS.md` or `CLAUDE.md` file, or a doc that another document points to. The packaging differs, but the writing is the same. The goal is that the agent follows the same process on every run, even when the output differs.

When the document is a skill, also read [`SKILL-MECHANICS.md`](SKILL-MECHANICS.md) for frontmatter, invocation, and router skills.

## Word the pointer to fire on the right cases

A **context pointer** is text in the agent's context that names material outside the context and says when to load it. A skill's description is a context pointer. So is a line in `AGENTS.md` that names a doc. The wording of the pointer decides when and how reliably the agent loads the material. If the agent must have the material but the pointer is weak, the agent loads it on some runs and skips it on others. Sharpen the wording first. Move the material inline only if sharper wording does not fix it.

A pointer states what the material is and lists the **branches** that should load it. A branch is a distinct case the document handles, so different runs take different paths through it. An always-loaded pointer costs tokens on every turn, so prune it harder than the body:

- Put the leading word first, because the pointer is where it triggers the load.
- Write one trigger per branch. Two synonyms for the same branch are one branch written twice. Keep one, and keep only branches that are really distinct.
- Cut any description of the skill that the body already gives.

## Spend the two loads deliberately

Every document and pointer you add costs one of two budgets.

**Context load** is the cost to the agent's context window. An `AGENTS.md` line or a skill description stays in context on every turn and uses tokens and attention whether or not it fires.

**Cognitive load** is the cost to the human, who must remember which documents exist and when to use each. Cognitive load is the price of human control, so it is not something to minimize. Spend it where human judgment matters, and remove it where judgment does not matter.

Material behind a pointer costs only the pointer's line of context load. Material with no pointer costs only cognitive load, because the human must remember to ask for it.

## Place each piece by how soon the agent needs it

A document holds two kinds of content. **Steps** are the actions the agent performs, in order. **Reference** is definitions, rules, and facts that the agent consults when it needs them. A document can be all steps, like a recipe, all reference, like a review's rule list or this skill, or a mix.

The main decision is where each piece sits on the **information hierarchy**. The hierarchy has three levels, ranked by how soon the agent needs the material:

1. An **in-file step** is what the agent does, in order. Steps come first.
2. **In-file reference** is in the same file, and the agent consults it when needed. A flat list of peer rules, such as every rule of a review at one level, is a fine arrangement.
3. **Disclosed reference** is in a separate file. The agent loads it only when a context pointer fires. The file can sit next to the main file or anywhere else that any document can point to.

If you push too little down, the main file gets too long. If you push too much down, you hide material the agent needs.

**Progressive disclosure** moves material out of the main file and behind a pointer so the main file stays readable. Its main purpose is to protect the hierarchy, and saving tokens is secondary. Use branches to decide. Keep inline what every branch needs, and move behind a pointer what only some branches need. Reference that should be disclosed but stays in the file buries the steps around it, and the agent then follows those steps on some runs and misses them on others.

**Co-location** decides what sits next to each piece within a file. Keep a concept's definition, rules, and caveats under one heading, so that reading one part also brings in the rest. The finished document should read like documentation written for the agent. Co-location is different from duplication. Duplication repeats one meaning in two places. Scattering splits one meaning across many places.

**Sprawl** is a document that is too long, even when every line is current and unique. The agent's attention spreads thin, and every extra line is one more line to keep current. To fix sprawl, move reference behind pointers, and split the document by branch or by sequence so each path carries only what it needs.

## End every step on a clear, demanding criterion

Every step ends on a **completion criterion**, which is the condition that tells the agent the step is done. Two properties of the criterion change how the agent behaves.

**Clarity** is whether the agent can tell done from not done. A vague criterion such as "understanding reached" invites **premature completion**, where the agent ends the step before it is done because it wants to be finished. The steps still ahead, the **post-completion steps**, pull the agent forward, and a clear criterion holds it in place. Fix this in order. First, make the criterion sharper, which is cheap and local. If the criterion cannot be made sharper and you see the agent rush, hide the later steps by splitting the sequence. Hiding works only across a real context boundary, such as a hand-off or a subagent. An inline skill call leaves the later steps in context.

**Demand** is how much work the criterion requires. "Every modified model accounted for" forces thorough work, and "produce a change list" does not. Demand drives **legwork**, which is the digging the agent does inside a step without a separate instruction for it. Demand also applies to reference. "Every rule applied" sets the bar for a list of rules the same way "every step done" sets it for a sequence, so an all-reference document can still require exhaustive work.

The strongest criteria are both checkable and exhaustive.

## Split only when the split pays for itself

Splitting one document into two adds context load or cognitive load, so split only for one of these reasons:

- **By sequence.** Split a run of steps when the later steps tempt the agent to rush the current one. With the later steps out of view, the agent does more legwork on the current step. Merging sequences has the opposite effect, because each step can then see the steps after it, which invites premature completion.
- **By invocation.** This applies only to skills. See [`SKILL-MECHANICS.md`](SKILL-MECHANICS.md).

## Use leading words

A **leading word** is a short concept the model already knows from pretraining, such as _lesson_, _fog of war_, or _tracer bullets_. The agent thinks with the word while it runs the document. Repeat the word itself, never a sentence that explains it again. Each use adds to its meaning, so one word can steer a whole area of behavior with very few tokens, because the model already knows what the word implies. You can coin a new word if you define it clearly, but the model knows nothing about a new word, so you pay in definition tokens for what an existing word gives for free. Try an existing word first.

A leading word works in two places. In the body, it steers execution. The agent repeats the same behavior each time the word appears, and in a list of rules the word tells the agent what kind of thing to look for. In a pointer, it steers invocation. When the same word appears in your prompts, your docs, and your codebase, the agent connects them and loads the material more reliably.

Look for passages that a leading word can replace, such as three adjectives repeated at three places, or a pointer that spends a sentence describing one idea. For example:

- Replace "fast, deterministic, low-overhead" with _tight_, as in "a _tight_ loop".
- Replace "a loop you believe in" with _red_. A loop either goes _red_ on the bug or it does not, so a fuzzy test becomes a yes-or-no state the agent can observe.

Each replacement uses fewer tokens and gives the agent one clear concept to work with. Assume every document restates ideas that a leading word could replace, and look for them.

**Negation** works against leading words. A prohibition puts the forbidden behavior into the agent's context and makes it more likely. "Don't add comments" makes the agent think about comments, and the word "don't" is too weak to cancel the stronger idea. State the behavior you want instead, such as "write one-line comments", so the forbidden behavior never appears in the text. Use a prohibition only for a hard limit that you cannot phrase positively, and pair it with the behavior you want.

## Prune every document

- Keep each meaning in a **single source of truth**, so that changing a behavior is a one-place edit. **Duplication** puts the same meaning in more than one place. It costs maintenance and tokens, and it makes the meaning look more important than it is. A leading word is different, because it repeats a word on purpose and never repeats the meaning.
- The **environment** is also a source of truth. It includes `package.json` scripts, config files, the directory layout, and `--help` output. A document that restates the environment is a **cache**, which earns its place only when the lookup is expensive. Write down what the agent cannot find by looking, such as an unwritten convention, the reason for a choice, or a pitfall that no config file reveals. Leave lookups that take one file or one command to the environment, where they stay current.
- Check every line for **relevance**, which is whether the line still affects what the document does. A line is irrelevant when it never affected the task, such as background explanation or a branch that belongs behind a pointer. A line also becomes irrelevant when the behavior it describes changes. Short documents are easier to keep relevant. Without regular pruning, documents collect **sediment**, which is layers of outdated text that hide the lines that still matter. Apply the `restraint` skill as that pruning, both before you add a line and when you review a document.
- Test each sentence for a **no-op**, which is an instruction the model already follows by default. A no-op costs tokens and changes nothing. The test is whether the sentence changes the model's behavior, so it depends on the model, not on the reader. When two people disagree about a no-op, they disagree about the default, so run the document to settle it. When a sentence fails the test, delete the whole sentence. The same test applies to leading words. A word too weak to change the default, such as _be thorough_ when the agent is already fairly thorough, is a no-op. Replace it with a stronger word, such as _relentless_.
