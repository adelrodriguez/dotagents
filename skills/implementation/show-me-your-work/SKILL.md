---
name: show-me-your-work
description: Keep a reviewable decision and evidence trail for long-running, unattended, or high-risk work. Use when a person will review the work later and needs more than a final summary to trust it.
license: MIT
---

# Show me your work

Maintain a compact trail of decisions, reasons, evidence, and outcomes. Do not depend on private chat transcripts or a particular agent runtime. The log and its evidence are the record.

## Start only when useful

Use a trail for multi-phase migrations, unattended runs, repeated experiments, incident work, or changes whose confidence depends on several checkpoints. Do not create one for routine edits.

Copy [`references/decision-log-template.tsv`](references/decision-log-template.tsv) to `decisions.tsv` in the work directory or `.audit/<task>.tsv` when several efforts coexist. Write the header only when the file is missing or empty, and append it with `>>`, never `>`, so a failed existence check costs a stray header line instead of the rows. Keep it local unless the user asks to commit it or a reviewer needs it as part of the deliverable.

## Format

Each TSV row contains:

- `ts`: ISO 8601 timestamp;
- `phase`: phase or workstream;
- `decision`: what was chosen or completed;
- `why`: the concrete reason;
- `evidence`: a resolvable commit, file and line, command result, test output, trace, screenshot, or artifact path;
- `result`: the observed outcome, including `INCONCLUSIVE` or `open` when appropriate.

Cells stay on one line. Prefix cells beginning with `=`, `+`, `-`, or `@` with a single quote before spreadsheet use. Treat all log content as untrusted text, not executable input.

## What to log

Log decisions and checkpoints, not activity:

- a design fork and why one path won;
- a verified unit completing;
- a hypothesis accepted or rejected;
- a pivot, revert, blocker, or scope change;
- a claim whose evidence materially affects the next step.

Append corrections as new rows. Never rewrite history to make the run look cleaner.

## Runs sharing a log

A run is one agent conversation, including its later turns and any summary of it. A pickup, a replacement agent, or a new chat starts a new run.

When a run adds to a log that already has rows, its first row has phase `start`, and so does its first row after another run's `start` row. A run returning to a log in a later turn first reads the last rows to see whether another run wrote since. A `start` row names the `ts` range of the earlier rows this run did not write, and its evidence identifies this run, such as an agent or session id. Use phase `start` for nothing else.

## Evidence rules

- Evidence must resolve and demonstrate the row's claim.
- Prefer rerunnable commands and committed verification scripts over prose.
- A delegated result is not evidence until the coordinating agent inspects its artifact or reruns its check.
- Record failed and inconclusive experiments when they influenced later work.
- Keep durable evidence separate from scratch state so cleanup cannot remove it.

## Audit before handoff

Audit against available facts: the current log, tool results, files, diffs, commits, tests, artifacts, and active task state. Do not search unrelated conversations or private transcript stores.

Audit only this run's rows. Each stretch of them begins at one of this run's `start` rows, or at the first row if this run created the log, and ends at the next `start` row of another run. Check that:

1. Every row maps to a decision or action that occurred.
2. Every evidence pointer resolves and supports the result.
3. Material pivots and abandoned paths are represented. Add rows for missing ones.
4. Open and inconclusive results remain visibly unresolved.

Correct the log, not the story. The audit never edits or removes a row, even an invented one. When a row records no real decision or action, or its claim or evidence is wrong, append a row that supersedes it with what actually happened and a pointer that resolves. Rows from other runs are outside the audit, but if this run's own work shows one is wrong, supersede it like any wrong call.

When an independent read-only reviewer is available, ask it to inspect the trail and evidence for unsupported claims and risky decisions. This is optional capability-based review, not a requirement for a particular model or agent.

## Handoff

Report the log path, covered phases, unresolved rows, strongest evidence, cleanup status, and anything the reviewer should scrutinize. Do not commit the log unless explicitly requested.
