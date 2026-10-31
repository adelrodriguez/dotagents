---
name: unslop
description: Use when the user asks to simplify, unslop, or improve text.
metadata:
  reference:
    - "https://github.com/cursor/plugins/blob/main/pstack/skills/unslop/SKILL.md"
---

# Unslop

Apply the `Write clearly` rules from your instructions, then check the additional patterns below. Rewrite while preserving meaning and matching the intended tone.

## Patterns to detect and fix

### Content

- **Superficial -ing phrases.** "highlighting...", "ensuring...", "reflecting...", "showcasing...", "fostering...". Delete or expand with real sources.

### Language

- **AI vocabulary.** Additionally, crucial, delve, enduring, enhance, fostering, garner, interplay, intricate, landscape (abstract), pivotal, showcase, suffice, tapestry (abstract), testament, underscore, vibrant. Replace with plain words.
- **Fancy ways to say "is".** "serves as", "stands as", "boasts", "features". Say "is" or "has".
- **"Not just X, but Y."** State the point directly instead.
- **Rule of three.** Don't force ideas into groups of three. Use the natural number.
- **Synonym cycling.** Protagonist, main character, central figure, hero all in one paragraph. Pick one, repeat it.
- **False ranges.** "from X to Y" where X and Y aren't on a meaningful scale. List topics directly.

### Style

- **Colon overuse.** Colons are fine before a list or example, not as mid-sentence connectors. "If you're coming from traditional automation: instead of registering event handlers, you describe conditions" adds nothing with the colon. Rewrite to let the point stand on its own without comparison framing. "Describing when the scheduler should fire works best as plain English." Same meaning, no crutch punctuation.
- **Boldface overuse.** Don't bold every proper noun or acronym.
- **Inline-header lists.** The tell is a bold label and colon that restates the line: "**Performance:** Performance improved...". Convert those to prose. A bold lead-in that ends in a period, names the item, and is followed by genuinely new detail ("**Schema in TypeScript.** Tables live in one file.") is fine, not a tell.
- **Decorative emojis.** Remove from headings and bullets.
- **Curly quotes.** Use straight quotes.

### Filler

- **Filler phrases.** "In order to" becomes "To". "Due to the fact that" becomes "Because". Delete "It is important to note that".
- **Excessive hedging.** "could potentially possibly be argued that it might" becomes "may".
- **Generic conclusions.** "The future looks bright." State specific plans or facts.

### Jargon

- **Abstract metaphor nouns.** Substrate (base), wedge, wedge in (add), vector (way, method), locus, vantage, nexus, primitive as a noun, harness as a metaphor, surface as in "API surface", bedrock, scaffolding as a metaphor, modality, paradigm, gold-plating (more than the job needs), ratchet as a metaphor (the mechanism's real name, or a limit that only tightens), evacuate for moving code (move out), endgame (the last phase), north star, flywheel. These read as technical but usually have a plainer concrete word. Pick the concrete word.

### Plain speech

- **Buried conditions.** Put the condition before the instruction: "If the upload fails, report the missing attachment."
- **Say what it does, not how it feels.** "the database stays close at hand", "SQL you can read", "types that follow your schema" name a feeling. The fix names the mechanism or a number: "`.toSQL()` returns the exact string sent to the database", "a column rename fails the build". Ask what the sentence tells the reader to do or know, then write that. If you can't restate it as a concrete instruction, fact, or number, cut it. One more check: if the sentence could appear unchanged in another project's docs, it says nothing about this one. Cut it.
- **Cut adverbs, or use a stronger verb.** "runs quickly" becomes "is fast" or the number, and "significantly improves" becomes the measured delta. An adverb propping up a weak verb means the verb is wrong.
- **Mannered prose.** Metaphor or flourish where a literal phrase exists: aphorisms ("wire it or delete it"), rhetorical fragments for effect, personified code ("the plan holds it"), figurative verbs ("rides along", "stands on"), stock framing phrases. "A dial worth turning" becomes "a parameter worth varying". Say what you mean. The abstract metaphor nouns rule covers those terms.

## Examples of the writing instruction

Use these examples when checking the core rules:

- Replace "utilize" and "leverage" with "use", "facilitate" with "help", "numerous" with "many", and "in the event that" with "if".
- Cut stock phrases such as "I hope this helps!", "Let me know if...", "Of course!", "Certainly!", and "Found the smoking gun!"
- Cut praise such as "Great question! You're absolutely right!"
- Rewrite "Parser rejects bad date → exit 2, no write" as "The parser rejects a bad date, exits with code 2, and writes nothing."
- Vague attributions include "Experts believe", "Industry reports suggest", and "Some critics argue".
- Unrequested framing includes "This isn't about X; it's about Y".
- Examples of "is/are/was/were + past participle": "queries are validated" becomes "the compiler validates queries", and "the file is parsed by the loader" becomes "the loader parses the file".
