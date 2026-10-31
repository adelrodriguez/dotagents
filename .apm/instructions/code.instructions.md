---
description: Rules for writing code and types.
applyTo: "**"
---

## Write code

- Write declarative code that reads as a statement of what it does. Build behavior from small, focused pieces, such as pipes, layers, schemas, and plain functions, that each read well alone and combine cleanly.
- Prefer explicit code over generators and factories. Inline a helper that has one caller. Add an abstraction only when it makes the code clearer, not only shorter.
- Keep configuration explicit. Derive duplicate values and types from their authoritative definition. Infer types from the value, registry, or return type that defines them, and annotate only what inference cannot reach.
- Use the strictest type settings. Narrow types instead of asserting them.
- Use the primitives of the libraries and platform the code already uses, such as Effect, Hono, or Expo, before you write your own.
- Represent errors as tagged errors, not as sentinel flags or boolean fields.
