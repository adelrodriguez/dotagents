---
name: restraint
description: Use when adding a UI element, animation, feature, copy, or code, or when reviewing a change for what to cut.
metadata:
  reference:
    - "https://jakub.kr/writing/less-is-more"
---

# Restraint

Adding is cheap and removing takes judgment. Every element, animation, feature, line of copy, and line of code must earn its place by making the user's outcome better. Simplicity comes from understanding the product, the user, and the problem well enough to know what to remove, what to leave alone, and what not to build.

## Before you add

For each addition, answer these from the product and the request:

- Who uses it, how often, and what are they trying to do at that moment?
- Does it make the outcome better for that person, or only make the result look busier?
- What is the smallest change that solves the problem?

If you cannot name the improvement in one sentence, leave the addition out.

## Weigh frequency

Cost grows with use. Something a person sees once can afford a flourish. Something they see hundreds of times a day must be instant and quiet.

A context menu opened 200 times a day with a 300ms open animation costs a minute a day and over 6 hours a year. Animate its close, if anything, and keep the open instant. Apply the same arithmetic to hover effects, confirmation steps, toasts, and tooltips on frequent paths.

## Keep the change small

- Solve the task with as little code as possible. A smaller diff that meets the goal beats a larger one that also adds extras.
- Add only what the request needs. Leave options, settings, variants, and abstractions for when a real caller asks for them.
- Prefer removing or reusing what exists over adding something new.
- Be able to explain what every line you add does and why it is there.

## Review by subtraction

When reviewing your own work or someone else's, read it once asking only what can go. Cut each element, animation, or line whose removal leaves the outcome as good or better. Question your first idea as hard as anyone else's.

Review the repository the same way. Delete superseded plans, duplicate checks, and scripts, CI jobs, dependencies, and files that no longer earn their place.

## Report

List what you chose not to add or removed, with one line of reason each, so the user can put back anything they want.
