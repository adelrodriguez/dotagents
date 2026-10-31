# Design it twice

Explore very different interfaces for one module in parallel, then compare them. A first idea is rarely the best one. The terms are defined in [`SKILL.md`](SKILL.md).

## Describe the problem

Before you start any subagents, write for the user:

- The constraints that any new interface must meet.
- The module's dependencies, sorted by the kinds in [`DEEPENING.md`](DEEPENING.md).
- A rough code sketch that makes the constraints concrete. Label it as an illustration, not a proposal.

Show this to the user, and start the subagents in the same turn.

## Start the subagents

Start three or four subagents in parallel. Give each one a technical brief with the file paths, the coupling between modules, the dependency kinds, and what sits behind the seam. Include the terms from `SKILL.md` and the repository's `GLOSSARY.md`, so every design uses the same names.

Give each subagent a different constraint:

1. Keep the interface to one to three entry points, with as much behavior behind each as possible.
2. Support many use cases and extensions.
3. Make the most common call as simple as possible.
4. When the module crosses a network or third-party service, design around interfaces and adapters at those seams.

Ask each subagent to return:

1. The interface, including types, methods, parameters, invariants, ordering rules, and errors.
2. An example of how callers use it.
3. What the implementation hides behind the seam.
4. Its dependencies and adapters, following `DEEPENING.md`.
5. Its tradeoffs, including where callers get the most and the least from it.

## Compare the designs

Present the designs one at a time, then compare them by depth, by where future changes would land, and by where the seams sit.

Recommend the strongest design and give the reason. When parts of different designs combine well, propose the combination. Include the designs in the proposal using `RATIONALE.md` as the template. Wait for the user's agreement as `SKILL.md` describes.
