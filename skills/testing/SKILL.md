---
name: testing
description: Use when writing, changing, or reviewing tests, or when fixing a bug.
---

# Write tests

Write tests that prove behavior. A test earns its place when it fails if the behavior it covers breaks.

## Start from the repository

Before writing, read the repository's test setup, helpers, fixtures, and the existing tests near the code. Match their structure, naming, and file placement. Run the test command from the repository's scripts, such as `package.json`, rather than calling the runner directly.

## Test through the interface

- Test what a caller can observe through the module's interface. The `codebase-design` skill defines the interface.
- Assert on results and outcomes, not on internal state, private functions, or the order of internal calls.
- Check that each test would survive a refactor that keeps the behavior. A test that changes when only the implementation changes is testing past the interface.
- Use real dependencies or local stand-ins, such as PGLite for Postgres, before mocks. Mock only third-party services you do not control.

## Fix a bug test-first

1. Write a test that reproduces the bug through the interface.
2. Run it, and confirm that it fails for the reason the bug describes. Read the failure message, not only the exit code.
3. Fix the code.
4. Run the test and confirm that it passes. Then run the rest of the suite.

If the test setup cannot reproduce the bug, say so, and record how you reproduced it instead.

## Strengthen weak tests

A test is weak when it passes even though the behavior is broken. Look for these signs:

- It asserts only that a value is defined or truthy, or that a call does not throw.
- It asserts on the mocks it set up rather than on the result.
- It snapshots a large output that no reviewer reads.

To check a test, break the behavior on purpose, such as by inverting a condition, and confirm that the test fails. Strengthen a weak test by asserting the exact value or outcome.

## Delete low-value tests

Delete a test when any of these is true:

- Another test already covers the same behavior.
- It tests a private detail that tests at the interface now cover.
- It tests the framework, the language, or a library rather than this code.
- The code or behavior it tests no longer exists.

## Test public types

When the change adds or changes an exported type, test the type. Use the repository's tool, such as Vitest's `expectTypeOf`, or `@ts-expect-error` lines that the type checker runs. Test that valid uses compile and that invalid uses fail.

## Check the tests

- Every new or changed test fails when the behavior it covers breaks.
- A bug fix includes a test that failed before the fix.
- No test asserts on internal state or private calls.
- Every exported type that changed has a type test.
- The full suite passes.

## Return the result

List the tests you added, strengthened, and deleted, with one line of reason each. For a bug fix, show the failing output from before the fix and the passing output after it.
