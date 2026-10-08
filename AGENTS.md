# Agent Instructions

## Coding Standards

### Structure

- **Structure makes wrong dependencies impossible.** Arrange code in folders whose dependencies point in one direction. Keep features independent of each other and apps independent of each other. Import with `#` subpath imports. Enforce each boundary with a lint rule (restricted imports, import cycles). A lint rule beats a test, and a test beats prose.
- **The public surface is small and deliberate.** Library logic lives in `lib/`, and `index.ts` exports only what consumers use. Packages declare explicit exports. Code that several apps share moves into a package with a clear role.
- **Organize by domain, not mechanism.** Write `features/objects/`, with `components/` and `services/` inside the domain. Describe architecture in terms that survive a framework swap.

### Code

- **Code expresses itself.** Write declarative code that reads as a statement of what it does. Build behaviour by composing small, focused pieces (pipes, layers, schemas, plain functions), each of which reads well alone and combines cleanly with the others.
- **Write it out.** Prefer explicit code over generators, factories and derived configs. Inline a helper that has one caller. An abstraction earns its place by making code clearer, not shorter.
- **One source of truth, everything else derived.** Infer types from the value, registry or return type that defines them. Annotate only what inference cannot reach.
- **Types are product.** Use the strictest settings. Narrow types instead of asserting them. Cover public types with `expectTypeOf` tests in a `types.test-d.ts` beside the entry point.
- **Shape APIs from the call site.** Put what every caller needs first, so no caller skips a parameter. Match the API of my sibling libraries.
- In React, declare components and hooks with `function`.

### Naming

- **Domain, then verb.** Group operations under the domain they act on, and name the operation with a verb: `trpc.students.create`, `tsgo.check()`, `yield* Database`.
- **Name a thing for what it is in the domain.** A service is `Database`, and its layer is a static on the class (`Database.layer`). Name contracts by domain, not by transport. Keep names short and let the module or namespace supply context. Check a name against every case it must cover, so a pattern never produces `AppApp`.

### Subtraction

- **Every test, script, CI job, dependency and file earns its place.** Delete superseded plans, duplicate checks and low-value tests.
- **Tests prove behaviour.** Strengthen weak tests. Fix bugs test-first: write a test that fails on the bug, then fix it. Put each test beside the file it tests, with the same name.
- **Understand a tool before silencing it.** Read a lint rule's docs and configure it precisely before disabling it. When a tool I depend on is wrong, fix it upstream with an issue or a PR, and keep any local workaround temporary.

### Consistency

- **One convention across all my repos.** Before you invent a structure, name, CI job or script, copy what my other repos do. CI jobs are named `check`, `analyze`, `unit`, `integration`, `e2e`, `compat`, `build` and `examples`. When a convention changes, propose applying it to every repo that uses it.
- **Guard what reaches `main`.** Pin dependencies to exact versions and respect the minimum release age, except for Adamantite, which I maintain. Changes reach `main` through PRs, and you merge only when I ask.

### Decisions

- **Propose before structural changes.** Rank the options, recommend one with its reason, and show a dry run. Act once I agree.
- **A "why" question asks for the reason.** Answer it, and change code only when I ask.
