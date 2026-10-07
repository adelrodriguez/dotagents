# dotagents

This repo stores my coding-agent setup. It keeps skills, global instructions, and the list of installed third-party skills under version control.

The checked-in files have three roles:

- [`skills/`](skills/) contains skills maintained in this repo.
- [`skills-lock.json`](skills-lock.json) records every installed skill and its source.
- [`AGENTS.md`](AGENTS.md) and [`CLAUDE.md`](CLAUDE.md) hold global agent instructions.

Generated skill files do not belong in Git. The Skills CLI restores them into `.agents/skills`, and `.gitignore` excludes both `.agents/` and `.claude/`.

`install.sh` installs public and private skills. It does not copy or link the root instruction files.

## Installation

The installation entry point is `./install.sh`. The script works from any directory because it finds the repo root before it changes files.

The script then performs these steps:

1. `npx --yes skills@latest experimental_install` restores the skills in `skills-lock.json` to `.agents/skills`.
2. A Node.js check confirms that every locked skill has a `SKILL.md` file.
3. `.claude/skills` points to `.agents/skills` so both project paths use the same files.
4. `~/.agents/skills` points to this repo's `.agents/skills`.
5. `~/.claude/skills` points to this repo's `.claude/skills`.
6. `install-private-skills.sh` runs the animations.dev installer in a temporary project. Its `prototype` is renamed to `prototype-ui`, including the skill name, before the private skills are copied into `.agents/skills`. Matt Pocock's `prototype` remains separate.
7. A temporary home directory limits the private installer to one project path. The script deletes that directory after installation, including on failure.

If a target path contains a directory, the script moves that directory to a timestamped backup before it creates the symlink. A second run keeps correct symlinks in place.

The script requires Node.js and `npx`. It reads the animations.dev token from `ANIMATIONSDEV_TOKEN` when that variable is set. Otherwise, it reads `op://Personal/animations.dev/token` with the 1Password CLI.

Set `ANIMATIONSDEV_TOKEN_REF` to read a different 1Password item. Set `SKILLS_CLI_VERSION` to use a Skills CLI version other than `latest`:

```sh
ANIMATIONSDEV_TOKEN_REF=op://Personal/animations.dev/token \
  SKILLS_CLI_VERSION=1.5.23 \
  ./install.sh
```

If private installation fails, refresh your credentials and rerun only the private installer:

```sh
eval "$(op signin)"
./install-private-skills.sh
```

The private installer works from any directory and accepts `ANIMATIONSDEV_TOKEN` or `ANIMATIONSDEV_TOKEN_REF`. It does not restore public skills or recreate links.

## Skill changes

Files under `skills/` are the maintained source. Entries in `skills-lock.json` that point back to this repo restore the published GitHub version, not uncommitted files in the working tree.

The Skills CLI adds or updates third-party skills and writes the result to `skills-lock.json`. The lock file is the installed-skill list. The generated `.agents/skills` directory is only a local copy.

## Skill catalog

The **Auto** column shows whether the agent can load a skill by itself when the skill's description matches the task. **Yes** means the model can invoke it. **No** means the skill sets `disable-model-invocation: true`, so it only runs when you call it, for example with `/arena`.

### Planning and design

| Skill | Use | Auto |
| --- | --- | --- |
| `architect` | Designs caller usage, types, signatures, and module boundaries before implementation. | Yes |
| `codebase-design` | Shared vocabulary for deep modules, seams, and testable interfaces. | Yes |
| `domain-modeling` | Builds a project's domain model: glossary terms and ADRs. | Yes |
| `grilling` | Questions you hard about a plan, decision, or idea. | Yes |
| `grill-me` | Runs a relentless interview to sharpen a plan or design. | No |
| `grill-with-docs` | Runs the same interview and writes ADRs and glossary entries as it goes. | No |
| `loop-me` | Questions you about specs for workflows you want to build. | No |
| `prototype` | Builds a throwaway prototype to check a state model, logic, or UI. | Yes |
| `to-questionnaire` | Turns an open decision into a questionnaire for someone else to fill in. | No |
| `to-spec` | Turns the current conversation into a spec on the issue tracker. | No |
| `to-tickets` | Breaks a plan or spec into tracer-bullet tickets with blocking edges. | No |
| `wayfinder` | Plans work too large for one session as a map of decision tickets. | No |
| `improve-codebase-architecture` | Finds deepening opportunities, reports them as HTML, then grills through one. | No |
| `setup-ts-deep-modules` | Wires dependency-cruiser so each TypeScript package is a deep module. | No |

### Implementation

| Skill | Use | Auto |
| --- | --- | --- |
| `implement` | Implements work from a spec or set of tickets. | No |
| `implement-spec` | Implements the output of `/to-spec` and `/to-tickets`. | No |
| `arena` | Runs parallel candidates for one task and grafts the best parts into one result. | No |
| `show-me-your-work` | Keeps a decision and evidence trail for long or unattended work. | Yes |
| `wizard` | Generates an interactive bash wizard for steps only a human can do. | Yes |
| `claude-handoff` | Hands the conversation to a fresh background agent that continues the work. | No |
| `handoff` | Compacts the conversation into a handoff document for another agent. | No |

### Understanding code

| Skill | Use | Auto |
| --- | --- | --- |
| `how` | Explains how a subsystem or flow works from source evidence. | Yes |
| `why` | Explains why something works the way it does, using history and tracker evidence. | No |
| `blast-radius` | Finds what a change could break outside the diff and proves the safety claim. | No |
| `packref` | Inspects the exact dependency source referenced by a Packref project. | Yes |
| `research` | Researches a question against primary sources and saves findings as Markdown. | Yes |
| `diagnosing-bugs` | Runs a diagnosis loop for hard bugs and performance regressions. | Yes |

### Review and quality

| Skill | Use | Auto |
| --- | --- | --- |
| `code-review` | Reviews changes since a fixed point against repo standards and the originating spec. | Yes |
| `interrogate` | Runs an adversarial review of a diff or design and gives a verdict. | Yes |
| `no-comments` | Audits comments and suppressions for stale narration and hidden debt. | Yes |
| `create-verification-skill` | Generates a project-local skill that verifies behavior through real surfaces. | Yes |
| `maintain-verification-skill` | Audits and repairs a project's verification skill when it drifts. | Yes |
| `product-description` | Builds a repo of documents that describe a product from the outside in, then verifies it. | No |
| `retro` | Runs a retrospective on a coding session. | No |
| `triage` | Moves issues and external PRs through triage and writes agent-ready briefs. | No |

### Engineering principles

These are all user-invoked (**Auto: No**). Each one applies a single rule from Cursor's pstack.

| Skill | Use |
| --- | --- |
| `principle-boundary-discipline` | Keeps validation and error handling at system boundaries. |
| `principle-build-the-lever` | Builds a tool, script, or codemod instead of working by hand. |
| `principle-encode-lessons-in-structure` | Turns repeated instructions into lints, checks, or scripts. |
| `principle-foundational-thinking` | Gets types and data structures right before writing logic. |
| `principle-make-operations-idempotent` | Makes steps converge to the same state after crashes and retries. |
| `principle-migrate-callers-then-delete-legacy-apis` | Migrates callers and deletes the old API in the same wave. |
| `principle-minimize-reader-load` | Removes layers and hidden state that make code hard to trace. |
| `principle-outcome-oriented-execution` | Converges on the target architecture without throwaway compatibility code. |
| `principle-prove-it-works` | Verifies against the real artifact before calling work done. |
| `principle-separate-before-serializing-shared-state` | Removes shared state before adding locks or queues. |
| `principle-sequence-verifiable-units` | Splits work into small units that each end in a verified state. |
| `principle-subtract-before-you-add` | Removes dead code first, then builds on the simpler base. |
| `principle-test-behavior-not-implementation` | Tests through the public interface against literal expected values. |
| `principle-type-system-discipline` | Makes illegal states unrepresentable and parses data at boundaries. |

### Git and pull requests

| Skill | Use | Auto |
| --- | --- | --- |
| `file-pr` | Files a concise pull request. | Yes |
| `monitor-pr` | Drives a pull request through review and CI with a shared watcher script that wakes the agent only when the PR needs it. | Yes |
| `graphite` | Manages stacked PRs with the Graphite `gt` CLI. | Yes |
| `write-changeset` | Writes or updates a changeset entry for staged changes. | Yes |
| `git-guardrails-claude-code` | Adds Claude Code hooks that block destructive git commands. | Yes |
| `setup-pre-commit` | Sets up Husky, lint-staged, type checks, and tests on commit. | Yes |

### Languages, frameworks, and tools

| Skill | Use | Auto |
| --- | --- | --- |
| `typescript-best-practices` | TypeScript conventions for any `.ts` or `.tsx` edit. | Yes |
| `adamantite` | Configures and runs Adamantite linting, formatting, and CI tooling. | Yes |
| `effect` | Guide for production TypeScript with Effect v4. | Yes |
| `effect-ts` | Sets up a repository that uses Effect. | Yes |
| `migrate-to-shoehorn` | Replaces `as` assertions in tests with `@total-typescript/shoehorn`. | Yes |
| `convex` | Routes Convex backend work to the right Convex guidance. | Yes |
| `convex-expert` | Writes code inside a `convex/` directory: schemas, functions, indexes, and auth. | Yes |
| `vercel-react-best-practices` | React and Next.js performance guidance. | Yes |
| `vercel-composition-patterns` | React composition patterns for flexible component APIs. | Yes |
| `vercel-react-native-skills` | React Native and Expo performance guidance. | Yes |
| `react-doctor` | Scans React code for lint, accessibility, bundle, and architecture issues. | Yes |
| `migrate-nativewind-to-uniwind` | Migrates a React Native project from NativeWind to Uniwind. | Yes |
| `write-swift` | Modern Swift: value types, Swift 6 concurrency, and API design. | Yes |
| `uv-package-manager` | Manages Python projects and dependencies with uv. | Yes |
| `agent-browser` | Drives a browser or Electron app from the CLI. | Yes |
| `linear` | Reads and updates Linear issues and projects. | Yes |
| `obsidian-markdown` | Writes Obsidian Flavored Markdown. | Yes |
| `obsidian-bases` | Creates and edits Obsidian `.base` files. | Yes |
| `obsidian-cli` | Manages an Obsidian vault through the Obsidian CLI. | Yes |
| `scaffold-exercises` | Scaffolds course exercises that pass linting. | Yes |

### UI and design

| Skill | Use | Auto |
| --- | --- | --- |
| `frontend-design` | Sets an intentional visual direction for new or reshaped UI. | Yes |
| `good-css` | Uses modern CSS techniques to reduce breakpoints, wrapper elements, and scripts. | Yes |
| `emil-design-eng` | Emil Kowalski's approach to UI polish and animation decisions. | Yes |
| `emil-design-engineering` | Design engineering patterns for polished, accessible web interfaces. | Yes |
| `apple-design` | Apple-style interface design and physical motion for the web. | Yes |
| `web-design-guidelines` | Reviews UI code against the Web Interface Guidelines. | Yes |
| `break-ui` | Stress-tests a component with worst-case data and reports what broke. | Yes |
| `mobile-native` | Makes a web app feel native on a phone. | Yes |
| `animate-expo` | Builds animations in React Native and Expo. | Yes |

### Writing and communication

| Skill | Use | Auto |
| --- | --- | --- |
| `html-communication` | Presents plans, reports, or mocks as readable HTML. | Yes |
| `writing-for-agents` | Writes skills, `AGENTS.md`, and `CLAUDE.md`. | Yes |
| `technical-writing` | Applies a layered technical-writing standard to docs, RFCs, and PRs. | No |
| `unslop` | Cuts AI tells from writing. | No |
| `bro` | Restates the last message in plain language. | No |
| `wait-what` | Re-pitches a message that did not land. | No |
| `teach` | Teaches you a skill or concept within the workspace. | No |
| `writing-fragments` | Mines raw writing fragments without structure. | No |
| `writing-beats` | Assembles raw material into a sequence of beats. | No |
| `writing-shape` | Shapes raw material into an article paragraph by paragraph. | No |

### Skill management

| Skill | Use | Auto |
| --- | --- | --- |
| `find-skills` | Finds and installs skills for a task. | Yes |
| `ask-matt` | Recommends which of Matt Pocock's skills fits your situation. | No |
| `setup-matt-pocock-skills` | Configures a repo's issue tracker, triage labels, and docs layout for Matt Pocock's skills. | No |

### animations.dev skills

`install-private-skills.sh` installs these from the private animations.dev installer. They are not in `skills-lock.json`.

| Skill | Use | Auto |
| --- | --- | --- |
| `animate` | Designs and builds web animations: easing, duration, springs, and transitions. | Yes |
| `css-animations` | Animates with CSS transitions, keyframes, transforms, and `clip-path`. | Yes |
| `motion-react` | Builds and debugs animations with Motion for React. | Yes |
| `gesture-ui` | Builds drag, swipe, and sheet interactions that track the finger. | Yes |
| `scroll-animations` | Builds scroll-triggered and scroll-driven animation. | Yes |
| `animation-accessibility` | Adds reduced-motion variants for every animation. | Yes |
| `animation-performance` | Keeps motion at 60fps with composite-only properties. | Yes |
| `debug-animation` | Diagnoses why an animation feels off before changing code. | Yes |
| `animation-vocabulary` | Names a motion effect from a vague description. | Yes |
| `motion-brief` | Interviews you about an animation until the brief has no blanks. | Yes |
| `pick-ui-library` | Picks the animation or UI library for a task. | Yes |
| `prototype-ui` | Builds several different versions of a UI behind a live picker. Renamed so it does not clash with `prototype`. | No |
| `find-animation-opportunities` | Finds the few places where motion would help. | No |
| `improve-animations` | Audits a codebase's motion and writes plans another agent can run. | No |
| `review-animations` | Reviews animation code against a high craft bar. | No |

## Attribution

Some skills were copied or adapted from other sources:

- [`architect`](https://github.com/cursor/plugins/blob/main/pstack/skills/architect/SKILL.md)
- [`arena`](https://github.com/cursor/plugins/blob/main/pstack/skills/arena/SKILL.md)
- [`bro`](https://github.com/cursor/plugins/blob/main/pstack/skills/bro/SKILL.md)
- [`create-verification-skill`](https://github.com/cursor/plugins/blob/main/pstack/skills/create-verification-skill/SKILL.md)
- [`file-pr`](skills/file-pr/SKILL.md): the visual, evidence, and merge danger sections are adapted from Matt Pocock's [`pr`](https://github.com/mattpocock/skills/blob/main/skills/engineering/pr/SKILL.md), whose visuals come from Dex Horthy's [`show-me`](https://github.com/humanlayer/skills/blob/main/plugins/show-me/skills/show-me/SKILL.md)
- [`how`](https://github.com/cursor/plugins/blob/main/pstack/skills/how/SKILL.md)
- [`interrogate`](https://github.com/cursor/plugins/blob/main/pstack/skills/interrogate/SKILL.md)
- [`maintain-verification-skill`](https://github.com/cursor/plugins/blob/main/pstack/skills/maintain-verification-skill/SKILL.md)
- [`no-comments`](https://github.com/cursor/plugins/blob/main/pstack/skills/no-comments/SKILL.md)
- [`product-description`](https://gist.github.com/steveruizok/83ae5c53f2784ebf8f5fe0a3fb94480f) by [Steve Ruiz](https://github.com/steveruizok)
- [`show-me-your-work`](https://github.com/cursor/plugins/blob/main/pstack/skills/show-me-your-work/SKILL.md)
- [`typescript-best-practices`](https://github.com/cursor/plugins/blob/main/pstack/skills/typescript-best-practices/SKILL.md)

The animation skills come from [animations.dev skills](https://animations.dev/skills). They are installed separately and are not tracked in `skills/` or `skills-lock.json`.
