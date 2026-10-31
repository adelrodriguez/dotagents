---
description: Naming rules for code, files, and tools.
applyTo: "**"
---

## Name things

- Group operations under the domain they act on, and name each operation with a verb, such as `trpc.students.create` or `tsgo.check()`.
- Name a thing for what it is in the domain. Call a service `Database`, as in `yield* Database`, with no `Live` or `Impl` suffix. Name contracts by domain, not by transport.
- Keep names short, and let the module or namespace supply the context.
- Check a name against every case it must cover, so that a pattern never produces a name such as `AppApp`.
