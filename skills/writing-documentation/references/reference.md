# Write reference

Reference is technical description of the machinery and how to operate it. The reader is at work and consults it to find facts they can trust. Reference is led by the product, not by what the reader is doing: like a marine chart, the same page serves the navigator plotting a course and the judge investigating a wreck.

Reference works like a map. The reader trusts it so they do not have to check the territory themselves. It must be wholly authoritative, with no doubt or ambiguity.

## Describe and only describe

Write neutral, austere description: accuracy, precision, completeness, and clarity. State what the machinery is and does: its APIs, classes, functions, commands, options, flags, defaults, limits, and error messages.

Describing neutrally is harder than it sounds, because people naturally explain, instruct, and give opinions. When description feels too thin to be useful, keep the entry as description and link to the how-to guide, explanation, or tutorial the reader needs. Reference may still state how something works or the correct way to use it.

Leave out speculation, interpretation, and marketing. On a food packet, a recipe or a sales claim mixed in with the allergen warning could be dangerous.

## Follow the structure of the machinery

Arrange reference to mirror the product. If a method belongs to a class in a module, the docs show the same nesting. Follow the code's logical and conceptual structure, and keep it natural rather than forcing it. A reader can then move through the docs and the code side by side, and any gaps become visible.

## Adopt standard patterns

Give every entry of a kind the same sections, in the same order, in the same format, so the reader finds each fact where they expect it. Use the same word for the same thing every time. Varied vocabulary and style have no place here.

## Provide examples

Add a short usage example to each entry, such as one call of the command with its output. Keep each example short. An example that grows into why or what-if has become explanation: move that part to an explanation page.

## Generate what you can

Generate API reference from the source when the tooling exists, so it stays faithful to the code. Generated output is a skeleton: add the descriptions, examples, and warnings the generator cannot write.

## Use the language of reference

- State facts: "The default logging configuration inherits Python's defaults. It is available as `django.utils.log.DEFAULT_LOGGING` and defined in `django/utils/log.py`."
- List: "Subcommands are: a, b, c, d."
- Warn, with the condition: "You must use a. You must not apply b unless c. Never d."

## Check the reference

- Every public item in the source has an entry, and every entry matches the source.
- The page structure mirrors the code structure.
- Entries of the same kind share one format.
- No entry instructs, explains, or gives an opinion beyond a link.
- Each entry has a short example.
