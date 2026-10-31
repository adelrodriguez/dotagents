---
name: codebase-design
description: Use when organizing or refactoring a codebase, or designing a module's interface or API.
metadata:
  reference:
    - "https://github.com/cursor/plugins/blob/main/pstack/skills/architect/SKILL.md"
    - "https://github.com/mattpocock/skills/blob/main/skills/engineering/codebase-design/SKILL.md"
---

# Design the codebase

Settle the shape of modules, APIs, and folders before you implement them. Start from the callers, compare designs that differ in structure, and wait for the user's agreement before you make a structural change.

## Start from the repository

Before designing, read the repository's `AGENTS.md`, `CODING_STANDARDS.md`, and `GLOSSARY.md` when they exist, and the modules around the change. Check comparable examples in my other repositories. Reuse structures and names that fit the current repository.

Trace every part of the system that the design touches:

- The current callers and the behavior users see.
- Which module owns each piece of state, and how data flows between modules.
- Public and persisted contracts, such as exported APIs, config files, and stored data.
- Where input is validated and where side effects happen.
- What must stay compatible, and how callers will migrate.

For new code, start from the user's needs, the runtime's constraints, and the repository's conventions instead. Write down what you could not confirm.

## Use these terms

- **Module**: anything with an interface and an implementation, such as a function, a class, a package, or a feature folder.
- **Interface**: everything a caller must know to use the module correctly. It includes the type signatures, invariants, ordering rules, errors, required configuration, and performance.
- **Depth**: how much behavior a caller gets for each part of the interface they learn. A deep module hides a lot of behavior behind a small interface. A shallow module's interface is nearly as complex as its implementation.
- **Seam**: the place where a module's interface lives, where behavior can change without editing the callers.
- **Adapter**: a concrete implementation that fills a seam, such as a Postgres store or an in-memory fake.

## Follow the design rules

- Make wrong dependencies impossible. Dependencies point in one direction, and independent parts stay independent. Enforce each boundary with tooling. A lint rule is better than a test, and a test is better than prose.
- Keep the public interface small and deliberate. Expose only what callers use, and keep everything else internal and free to change.
- Organize by domain, not mechanism. Name a folder after what it is about, and put mechanism folders such as `components/` inside it. Describe the architecture in terms that would survive a change of framework.
- Shape APIs from the call site. Put what every caller needs first, so that no caller skips a parameter. Match the APIs of my sibling libraries.
- Prefer deep modules. To test a module's depth, imagine deleting it. If the complexity vanishes, the module was a pass-through. If the complexity reappears in every caller, the module earns its place.
- Add a seam only when something varies across it. One adapter is a guess, and two adapters, such as production and test, make a real seam.
- Design for the next contributor: an agent that sees only the files it opened, copies the nearest example, and takes the shortest path that compiles. Prefer the design where a change that looks right in one file is right for the whole repository.

## Write caller usage first

Before you define types, sketch two or three realistic call sites. Include the normal use, an important failure, and how the call combines with the code around it. The interface exists to make these call sites clear and hard to misuse.

## Compare the designs

For a decision that is hard to reverse, write at least two structurally different designs. For a small, local change, write one design and one rejected alternative.

Describe each design with:

- Its caller usage.
- Its core data types and invariants.
- Its function or method signatures.
- Which module owns what, and the direction of each dependency.
- Where validation, errors, state, and concurrency are handled.
- The steps to migrate callers and delete the old code.
- The tradeoffs it accepts.

Check each design against [`references/red-flags.md`](references/red-flags.md). To explore very different interfaces in parallel, follow [`references/design-it-twice.md`](references/design-it-twice.md).

## Propose the design and wait

Choose the design that hides the necessary complexity behind the smallest interface. Reject a design that is easier to implement but harder to call, test, or change.

Write the proposal using [`references/rationale.md`](references/rationale.md) as the template. Rank the designs, recommend one with its reason, and show a dry run, such as the new file tree or a diff of the call sites.

Wait for the user's agreement before implementing the proposed design.

## Implement the agreed design

When the user asks for implementation, create the agreed types, signatures, and module boundaries before you fill in the behavior. Keep each step verifiable.

Record each place where the implementation departs from the design. A missing parameter can be an implementation detail. If any of these signs appears, explain why the design needs it. Revise the design when the explanation reveals a missing constraint:

- Repeated casts.
- Optional fields that every caller sets.
- Layers that only pass calls through.
- Locks around shared state.
- Callers that need to know a module's internals.

When the same workaround appears in more than one place, stop patching around it. Write down the constraint you learned, remove the code built for the old shape, and redesign as if the constraint had existed from the start. If the new design changes what the user agreed to, propose it again.

## Deepen existing modules

When the task is to refactor a cluster of shallow modules into a deeper one, follow [`references/deepening.md`](references/deepening.md).

## Reorganize code into folders

When the user asks to reorganize code, such as "refactor all this logic into folders with clear dependencies in a single direction", follow these steps:

1. Map the current imports between files, and list every cycle.
2. Group the files into folders by domain, following the design rules.
3. Order the folders so that each one imports only from folders below it. Shared code that many domains use sits at the bottom, and entry points such as routes, commands, and the app shell sit at the top.
4. Decide what each folder exports, and keep everything else internal to it.
5. Propose the new file tree and a diagram of the allowed dependencies as the dry run, then wait for the user's agreement.
6. Move the code in steps that each keep the build and tests passing.
7. Add a lint rule that rejects imports against the agreed direction and imports of a folder's internals. When the repository's tooling cannot express the rule, add a test that fails on those imports.

The reorganization is complete when the affected imports contain no cycles and the lint rule or dependency test passes.

## Check the design

- Every part of the system that the design touches is traced, and anything unconfirmed is written down.
- The caller usage was written before the types.
- Each design was checked against `references/red-flags.md`.
- The proposal ranks the designs and includes a dry run.
- The user agreed before implementation began.
- After a reorganization, imports point in one direction, no cycles remain, and a lint rule or test enforces the direction.

## Return the result

Return the proposal using `references/rationale.md` as the template. After implementation, also report where the implementation departed from the design, the risks that remain open, and how you verified the change.
