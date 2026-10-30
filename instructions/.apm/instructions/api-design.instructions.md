---
description: How to shape and name APIs, operations, services, and contracts
---

# API design

- **Shape APIs from the call site.** Put what every caller needs first, so no caller skips a parameter. Match the API of my sibling libraries.
- **Domain, then verb.** Group operations under the domain they act on, and name the operation with a verb: `trpc.students.create`, `tsgo.check()`, `yield* Database`.
- **Name a thing for what it is in the domain.** A service is `Database`, with no `Live` or `Impl` suffix. Name contracts by domain, not by transport. Keep names short and let the module or namespace supply context. Check a name against every case it must cover, so a pattern never produces `AppApp`.
