---
name: how
description: Explain how a subsystem, feature flow, or module works from source evidence. Use for code walkthroughs, runtime traces, ownership questions, and layering questions.
license: MIT
---

# How

Build a working mental model from the codebase. Explain the system at the level needed to change it safely, not as annotated source code. Describe the architecture and runtime behavior without judging the design. For problems, risks, or improvements, use `interrogate` once the explanation exists.

## Scope the question

State a reasonable interpretation when the question is ambiguous and continue unless a wrong interpretation would waste substantial work. Identify whether the answer is:

- local to one symbol or module
- a flow spanning several components
- a cross-cutting subsystem or ownership question

Use the smallest exploration strategy that can answer the question. Read directly for local questions. For broad questions, divide exploration into 2 to 4 distinct concerns such as entry points, state, control flow, external boundaries, and observability. When in doubt, take the smaller strategy.

## Explore from evidence

Parallelize independent exploration when the active agent supports it, but do not require a particular model, agent type, or tool. Every exploration pass must:

1. Find concrete entry points, important types, and ownership boundaries.
2. Trace callers, callees, state changes, and effects from trigger to observable result.
3. Read implementations rather than infer behavior from names.
4. Identify validation, retries, concurrency, persistence, and external boundaries when relevant.
5. Record exact file and symbol references.
6. Note anything surprising, historically motivated, or easy for a newcomer to get wrong.
7. Mark uncertainty instead of filling gaps with plausible behavior.

Reconcile overlapping or contradictory findings against source into one picture. Use runtime evidence when static inspection cannot settle behavior.

## Explain

Adapt this structure to the question, dropping sections that do not apply:

- **Overview:** What the subsystem does, why it exists, and where its boundary lies. A reader should be able to stop here and decide whether to continue.
- **Key concepts:** Only the types, services, or abstractions required for the mental model.
- **How it works:** The longest section. A trigger-to-result walkthrough with decision points, data flow, and state transitions.
- **Where it lives:** The few files and directories a maintainer should open first.
- **Gotchas:** Surprising behavior, hidden coupling, operational constraints, and unresolved uncertainty.

Write in prose, not pseudocode. Reference concrete files and symbols. Include snippets only when prose cannot communicate the mechanism precisely.

Add a diagram when several components talk to each other or data transforms through stages. Use mermaid for sequences, flowcharts, and component graphs, and ASCII for simpler relationships. Skip the diagram when prose already covers the flow.

Name the actual pieces: write "`UserService` calls `AuthClient.refresh()`", not "the service delegates to the client". When something is complex, explain why. When something is simple, keep it short. Use an analogy only when one fits naturally. State open questions and gaps instead of hiding them.
