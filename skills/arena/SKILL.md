---
name: arena
description: Spawn parallel candidates for the same task, select a base, and graft the strongest parts into one verified result.
disable-model-invocation: true
---

# Arena

Run several independent attempts at the same task, choose the strongest base, integrate the best parts of the alternatives, and verify the synthesized result.

Use six phases: frame, fan out, cross-judge, pick, graft, and verify. Track them with the harness's task-list facility when one is available.

## 1. Frame

Define the artifact every candidate must produce. Derive three to six concrete, gradeable criteria from the task. For example, `Adds a --dry-run flag that skips writes` is gradeable; `Code is correct` is not.

Use four candidates by default when cost and agent capacity allow, with two as the minimum. Prefer different model families when the harness supports model selection. Otherwise use separate agent contexts so the attempts remain independent.

Give every candidate the same task and grounding. Keep the rubric for judging rather than steering candidates toward one shape.

Keep candidate writes isolated. Use separate worktrees or temporary workspaces when candidates must produce files. When isolated writable workspaces are unavailable, require candidates to return their artifacts without modifying the shared workspace. Only the coordinating agent writes the synthesized result.

The frame is complete when the artifact, rubric, candidates, grounding, and isolation strategy are explicit.

## 2. Fan Out

Launch all candidates concurrently through the harness's available agent mechanism. Give each candidate:

- the same task and grounding;
- its own output location or response channel;
- a requirement to produce the artifact and a short rationale;
- a requirement to name alternatives considered and rejected.

Proceed with the successful candidates if one drops out, provided at least two independent results remain. Otherwise report that the arena could not produce comparative evidence.

Fan-out is complete when every surviving candidate has produced a complete artifact and rationale.

## 3. Cross-Judge

After candidate outputs are stable, launch one independent, read-only judge. Prefer a model family not used by the coordinating agent when selectable; otherwise use a separate agent context.

Give the judge the rubric and anonymized or neutrally labeled candidate outputs. Ask it to score every candidate criterion by criterion and recommend a base with evidence. Run this judgment concurrently with the coordinating agent's own full reading of every candidate.

Cross-judging is complete when both the judge and coordinating agent have evaluated every complete candidate.

## 4. Pick

Score each candidate against every rubric criterion. Do not pick by familiarity, majority vote, or surface polish.

Compare the independent judge's recommendation with the coordinating agent's assessment. Resolve disagreement by rereading the artifacts and rationales against the rubric. Prefer the candidate that a maintainer can extend without breaking its invariants; when otherwise tied, prefer the cleaner boundary and smaller surface area.

Record the selected base and why it won. Picking is complete when one base is selected by evidence from the rubric.

## 5. Graft

Read each losing candidate again and identify the small number of ideas worth carrying into the base. Integrate them by hand so the result retains one coherent design. Do not mechanically paste incompatible structures together.

Record each graft's source and purpose, plus meaningful rejections and their reasons. If candidates converge on the same shape, record the convergence and skip unnecessary grafting. If they diverge so widely that the rubric cannot compare them, return to framing and rerun the arena instead of averaging incompatible answers.

Grafting is complete when the result has one coherent mental model and every accepted or rejected alternative is accounted for.

## 6. Verify

Verify the synthesized artifact through the real project surface: run its tests, execute it, inspect the rendered result, or use the strongest applicable check. The arena does not substitute for verification.

If verification exposes a missed requirement, decide whether the frame was incomplete or a candidate already held the missing idea. Reframe and rerun, or return to grafting accordingly.

Verification is complete when the final artifact passes the task's applicable checks or the remaining failure is reported explicitly.

## Output

Return one synthesized artifact and one concise synthesis note. The note names the base, rubric result, grafts and their sources, meaningful rejections, candidate dropouts, judge disagreement, and verification evidence. Store it beside the artifact when the work produces files; otherwise include it in the final response.
