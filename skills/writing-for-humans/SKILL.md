---
name: writing-for-humans
description: Use when writing or editing text that ships in a product or website, such as UI labels, buttons, errors, empty states, onboarding, marketing pages, and emails.
metadata:
  reference:
    - "https://github.com/blader/humanizer/blob/main/SKILL.md"
---

# Write for humans

Write copy that people read in the product. For PR descriptions, issues, and comments, use the `unslop` skill instead.

## Start from the product

Before writing, read the existing copy on the same screen and the screens around it. Also read the repository's `GLOSSARY.md`, voice or content guidelines, and design system docs when they exist.

Match the product's terms, tone, capitalization, and language. If the existing copy conflicts with the rules below, follow the product and mention the conflict.

Use only facts from the code, the product, or the user. Never invent numbers, quotes, testimonials, customer names, features, or claims. If the copy needs a detail you do not have, ask for it or write a simpler line.

## Earn every line

Every line and element on screen must help the user act or understand. Apply the `restraint` skill before adding any. Cut these:

- Eyebrow text above headings, and other eyebrow elements such as pills, badges, and small labels that sit on top of the real content.
- Subtitles and helper text that repeat the heading or label.
- Taglines and slogans that nobody asked for.
- Text that describes the page itself, such as "This page shows your goals."

If the interface already makes something clear, leave it unsaid.

## Write each kind of copy

- Buttons and links: Use a verb that names the result, such as "Save changes" or "Delete goal". Avoid "Submit", "OK", and "Click here". Use the same word for the action in the button, the confirmation, and the toast.
- Headings: Name what the section holds, in sentence case.
- Errors: Say what happened and what the user can do next. Do not blame the user. Do not write "Oops" or "Something went wrong" without a next step.
- Empty states: Say what is missing and offer the one action that fills it.
- Destructive confirmations: Name the item and the consequence, such as "Delete Morning run? Its 12 check-ins will be deleted too."
- Success messages: State the result briefly. Skip celebration unless the product's voice uses it.
- Numbers: Format numbers for the locale, such as "1,500" rather than "1500". Use numerals for counts.
- Alt text and accessible labels: Describe the purpose, not the appearance. An icon button's label is its action.

## Avoid AI patterns

These patterns make copy read as generated. Rewrite each one as a direct statement of what the product does.

- Contrast framing, such as "Not just a to-do app. A habit system." State what the product is.
- Staccato sentences and dramatic fragments, such as "More reliable. Less expensive.", "Sleep better. Live longer.", or "No setup. No config. Just results." Never use them, especially on landing pages. Write one full sentence with the specific claim from the source, and combine related short sentences.
- Forced triads, such as "Fast, simple, secure." Keep three items only when there are three real ones.
- Sales and inflation words, such as seamless, powerful, effortless, robust, unlock, elevate, supercharge, game-changing, and "the future of". Name the specific benefit or cut the claim.
- AI vocabulary, such as delve, crucial, vibrant, showcase, tapestry, testament, and pivotal. Use plain words.
- Sayings that sound deep, such as "Consistency is the currency of change." Replace the saying with the specific claim.
- Unsourced authority, such as "Trusted by teams everywhere" or "Loved by thousands." Use a real, sourced number or cut the claim.
- Fancy ways to say "is", such as "serves as", "boasts", and "features". Use "is" or "has".
- Decoration, such as emoji bullets, Title Case headings, bold on every feature name, and exclamation marks on routine messages.
- Em dashes. Use a period, comma, or colon.

## Check the copy

- Check each string at the real width with the longest likely value. Use the `break-ui` skill to test long names, large counts, and missing values.
- Check that each thing has the same name everywhere it appears.
- Check that the copy adds no claim, number, or feature that the source does not support.
- For a translated product, write in the product's language, avoid idioms, and leave room for translations to grow about 30%. Put new strings in the product's translation files when it has them.

## Return the result

Return the copy as it will ship. When you edit existing copy, list each changed string with its file, in a table with "Before" and "After" columns.
