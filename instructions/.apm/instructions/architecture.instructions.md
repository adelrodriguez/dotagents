---
description: Dependency direction, public surface, and folder layout
---

# Architecture

- **Structure makes wrong dependencies impossible.** Dependencies point in one direction, and independent parts stay independent. Enforce each boundary with tooling: a lint rule beats a test, and a test beats prose.
- **The public surface is small and deliberate.** Expose only what consumers use, and keep everything else internal and free to change.
- **Organize by domain, not mechanism.** Name a folder after what it is about, with mechanism folders such as `components/` inside it. Describe architecture in terms that survive a framework swap.
