---
name: arena
description: Spawn parallel candidates for the same task, select a base, and graft the strongest parts into one verified result.
disable-model-invocation: true
---

# Arena

Run several independent attempts at the same task, choose the strongest base, graft the best parts of the others into it, and verify the result.

Track the six phases (frame, fan out, cross-judge, pick, graft, verify) with the harness's task-list facility when one is available, before launching anything.

## 1. Frame

Every candidate gets the same task and grounding, so the task is the contract.

1. Define the artifact every candidate must produce.
2. Derive three to six concrete, gradeable criteria for what success looks like on this task. `Adds a --dry-run flag that skips writes` is gradeable. `Code is correct` is not. The rubric is for judging. Candidates only see the task.
3. Choose the candidates. Use at least two, and more when the arena covers several design directions. Prefer different model families when the harness supports model selection, and separate agent contexts otherwise. Use the same model several times when the work is generation-bound rather than judgment-sensitive.
4. Isolate candidate writes. Give each candidate its own worktree or temporary workspace. When isolated writable workspaces are unavailable, have candidates return their artifacts without touching the shared workspace. Only the coordinating agent writes the synthesized result.

## 2. Fan Out

Launch all candidates concurrently through the harness's agent mechanism. Give each the task, the grounding, its own output location or response channel, and instructions to produce the artifact plus a short rationale naming the alternatives it considered and rejected. Without the rationale you cannot tell whether a candidate's structure is principled or accidental, which makes grafting unreliable.

If a candidate produces no output, proceed with the rest and note the dropout, provided at least two independent results remain. Otherwise report that the arena could not produce comparative evidence.

## 3. Cross-Judge

Wait until every candidate has finished. A judge launched while candidates are still writing sees partial or empty outputs and reports them as dropouts.

Then launch one independent, read-only judge, preferring a model family different from the coordinating agent's when selectable. Give it the rubric and neutrally labeled candidate outputs. Ask it to score every candidate criterion by criterion and recommend a base with evidence. It runs concurrently with your own reading in the pick phase.

## 4. Pick

Read every candidate end to end before picking. Skimming surfaces only the candidate that looks most familiar. Score each against the rubric criterion by criterion, not on holistic feel, majority vote, or surface polish, and compare with the judge. Agreement confirms the pick. Disagreement means one of you is biased or the rubric was ambiguous, so reread both rationales and the artifacts before deciding.

Pick the base a future maintainer can extend most easily without breaking invariants. When two feel tied, prefer the cleaner boundary or smaller API.

## 5. Graft

Walk each losing candidate once more for what is worth porting into the base, usually one or two things per candidate, not most of it. Fold each graft in by hand so the result stays coherent under one mental model. Don't paste incompatible structures together.

If the candidates converge on one shape, that is strong agreement. Note it and ship the consensus shape without grafting. If they diverge so widely that the rubric cannot compare them, the frame was under-specified. Reframe and rerun rather than averaging the divergence.

## 6. Verify

Verify the synthesized artifact like any other output, through the real project surface: run its tests, execute it, inspect the rendered result, or use the strongest applicable check. The arena does not earn a pass.

If verification finds a problem the arena missed, either the frame was wrong (reframe and rerun) or a candidate caught it and you missed the graft (return to grafting). Don't paper over it. If a failure remains, report it explicitly.

## Output

One synthesized artifact, with a short synthesis note naming the base and why it won, the judge's verdict and any disagreement, each graft with its source candidate, what was rejected and why, any convergence or dropouts, and the verification result. Rejections are the highest-signal part of the note. Store the note beside the artifact when the work produces files, otherwise include it in the final response.
