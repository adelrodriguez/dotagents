# Deepen shallow modules

Merge a cluster of shallow modules into one deeper module, and test it through its new interface. The terms module, interface, seam, and adapter are defined in [`../SKILL.md`](../SKILL.md).

## Sort the dependencies

Sort each dependency of the cluster into one of four kinds. The kind decides how you test the deepened module.

| Kind | Examples | How to deepen and test |
| --- | --- | --- |
| In-process | Pure computation, in-memory state | Merge the modules and test the new interface directly. No adapter is needed. |
| Local stand-in | Postgres with PGLite, a filesystem with an in-memory filesystem | Merge the modules and run the stand-in in the tests. The seam stays inside the module. |
| Owned and remote | Your own services, reached over a network | Define an interface at the seam. Production uses an HTTP, gRPC, or queue adapter, and tests use an in-memory adapter. |
| Third-party | Stripe, Twilio | Pass the service in through an interface. Tests use a mock adapter. |

## Place the seams

- Add an interface at a seam only when at least two adapters need it, usually production and test. With one adapter, the interface is indirection.
- Keep internal seams internal. A deep module can have seams that only its own tests use. Do not expose them in the interface for the tests' sake.

## Replace the tests

- Write new tests at the deepened module's interface.
- Assert on outcomes that a caller can observe, not on internal state.
- Delete the old tests on the shallow modules once tests at the new interface cover the same behavior.
- Check that the tests would survive a refactor of the implementation. A test that has to change when only the implementation changes is testing past the interface.

The `testing` skill covers the rest of how to write these tests.
