# dotagents

This repo stores my coding-agent setup. It keeps skills, global instructions, and the list of installed third-party skills under version control, and [APM](https://github.com/microsoft/apm) installs them for Claude Code, Codex, OpenCode, and Grok.

The checked-in files have four roles:

- [`skills/`](skills/) contains skills maintained in this repo. A skill changed from another source records the original in its `metadata.source` frontmatter.
- [`instructions/`](instructions/) is an APM package holding the global agent instructions.
- [`apm.yml`](apm.yml) lists every third-party skill, the instructions package, and the agents to install for.
- [`apm.lock.yaml`](apm.lock.yaml) pins each dependency to a commit and records the hash of every installed file.

The repo must be cloned to `~/.apm`. APM reads its user-scope manifest only from there and refuses a symlinked `~/.apm`.

## Installation

Installing needs [APM](https://github.com/microsoft/apm) and read access to the private [`adelrodriguez/private-skills`](https://github.com/adelrodriguez/private-skills) repo. APM uses your git credentials, so `gh auth login` is enough.

Clone the repo first. APM writes its own files to `~/.apm`, and `git clone` refuses a folder that isn't empty:

```sh
git clone https://github.com/adelrodriguez/dotagents.git ~/.apm
```

Install APM with Homebrew, on macOS or Linux:

```sh
brew install apm
```

On Linux without Homebrew, use APM's installer instead:

```sh
curl -sSL https://aka.ms/apm-unix | sh
```

Then sync:

```sh
make -C ~/.apm
```

`make` runs two commands:

1. `apm install --global` installs everything in `apm.lock.yaml`. If `apm.yml` and the lock disagree, it updates the lock to match, so check `git status` after a sync.
   - Skills go to `~/.claude/skills` for Claude Code and `~/.agents/skills` for Codex. OpenCode gets its own copy in `~/.config/opencode/skills`. Grok reads the Claude folder.
   - The skills in `skills/` are deployed from the working tree, so local edits apply on the next sync. APM installs only the ones listed in `apm.yml` by path.
   - The instructions go to `~/.claude/rules/coding-standards.md`. Grok reads that folder too.
2. `apm compile --global` writes `~/.codex/AGENTS.md` and `~/.config/opencode/AGENTS.md` from the instructions package.

### Switching from the old setup

The old `scripts/link.sh` symlinked skill folders and `AGENTS.md` into whichever dotagents checkout ran it. APM can't write through those links, so remove them once before the first `make`.

First, check that no skill lives only in the old checkout. Removing the links hides anything APM doesn't install. `~/.agents/skills` still points at the old skills, so this lists the ones missing from the lock:

```sh
sh -c 'cd ~/.apm && for skill in $(ls "$(readlink ~/.agents/skills)"); do
  grep -q -- "- .claude/skills/$skill\$" apm.lock.yaml || echo "$skill"
done'
```

Add any you want to keep to `apm.yml`, or to `skills/` with an entry in `apm.yml`. A `synced` folder is Claude's own cache of its built-in skills, and Claude recreates it.

Then remove the links. This deletes only symlinks, including broken ones:

```sh
sh -c 'for link in ~/.claude/skills ~/.agents/skills ~/.claude/CLAUDE.md \
  ~/.codex/AGENTS.md ~/.config/opencode/AGENTS.md ~/.pi/agent/AGENTS.md; do
  if [ -L "$link" ]; then rm "$link"; fi
done'
```

Then delete the old checkout. If you still use it for development, delete only its untracked `.agents/` and `.claude/` folders.

## Syncing

Run `make -C ~/.apm` again after pulling or after editing `skills/`.

`unslop` used to be installed from `cursor/plugins` and now comes from `skills/`. APM refuses to overwrite a copy it doesn't own, so on a machine that still has the upstream copy, remove it once before syncing:

```sh
rm -r ~/.claude/skills/unslop ~/.agents/skills/unslop ~/.config/opencode/skills/unslop
```

## Changes

| Task | Command |
| --- | --- |
| Add a skill | `apm install --global owner/repo --skill name` |
| Add a skill of your own | Create `skills/<name>/SKILL.md`, add `- ~/.apm/skills/<name>` to `apm.yml`, then run `apm install --global`. For one changed from another source, set `metadata.source` to the original. |
| Update every dependency | `apm update --global && apm compile --global` |
| Remove a dependency | `apm uninstall --global owner/repo` |

Each command updates `apm.yml` or `apm.lock.yaml` in this repo. Commit the result.

Repos that keep skills outside a flat `skills/<name>/` folder need one entry per skill, with its folder as `path:`.

The instructions are fetched from `main` on GitHub, not read from the working tree. A change to `instructions/` reaches your agents after it is merged and you run `apm update --global && apm compile --global`.

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
| `security-audit` | Reviews code for vulnerabilities and runs full audits with verified, machine-readable findings. | Yes |
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
| `full-send` | Takes a task from first edit to merged PR with no user review, using `file-pr` and `monitor-pr`. | Yes |
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
| `apple-design` | Apple-style interface design and physical motion for the web. | Yes |
| `break-ui` | Stress-tests a component with worst-case data and reports what broke. | Yes |
| `mobile-native` | Makes a web app feel native on a phone. | Yes |
| `animate` | Designs and builds web animations: easing, duration, springs, and transitions. | Yes |
| `animation-performance` | Keeps web animations inside the frame budget with composite-only properties. | Yes |
| `animation-vocabulary` | Names a motion effect from a vague description. | Yes |
| `ask-sonner` | Sets up, styles, and troubleshoots Sonner toasts. | Yes |

### Expo

All from [expo/skills](https://github.com/expo/skills). `expo-overview` is the entry point that routes to the others.

| Skill | Use | Auto |
| --- | --- | --- |
| `expo-overview` | Routes any Expo or EAS task to the right skill. | Yes |
| `expo-project-structure` | Lays out the folders of a new Expo Router app. | Yes |
| `expo-router` | Builds Expo Router navigation: routes, stacks, tabs, modals, and headers. | Yes |
| `expo-native-ui` | Styles native-feeling Expo screens with Apple HIG colors, controls, and effects. | Yes |
| `expo-ui` | Builds native SwiftUI and Jetpack Compose UI in Expo with `@expo/ui`. | Yes |
| `expo-design-system` | Builds a token-based design system and component conventions in an Expo app. | Yes |
| `expo-animation` | Builds animations in React Native and Expo. | Yes |
| `expo-data-fetching` | Implements network requests, caching, offline support, and Expo Router loaders. | Yes |
| `expo-dom` | Runs web code in a webview on native with Expo DOM components. | Yes |
| `expo-web-to-native` | Migrates a web React app to a native iOS and Android app. | Yes |
| `expo-brownfield` | Embeds Expo and React Native in an existing native app. | Yes |
| `expo-module` | Writes Expo native modules and views in Swift and Kotlin. | Yes |
| `expo-app-clip` | Adds an iOS App Clip target to an Expo app. | Yes |
| `expo-examples` | Finds Expo's official `with-*` example for a third-party integration. | Yes |
| `expo-upgrade` | Upgrades the Expo SDK and fixes dependency issues. | Yes |
| `expo-dev-client` | Builds and distributes development clients for internal testing. | Yes |
| `eas-app-stores` | Builds and submits apps to TestFlight, the App Store, and Google Play. | Yes |
| `eas-update` | Publishes over-the-air updates with EAS Update. | Yes |
| `eas-update-insights` | Checks crash rates, launches, and adoption of published EAS Updates. | Yes |
| `eas-workflows` | Writes EAS workflow YAML for CI/CD. | Yes |
| `eas-hosting` | Deploys Expo websites and API routes to EAS Hosting. | Yes |
| `eas-observe` | Adds EAS Observe performance metrics to an Expo app. | Yes |
| `eas-simulator` | Runs an app on a remote EAS cloud simulator. | Yes |

### Writing and communication

| Skill | Use | Auto |
| --- | --- | --- |
| `html-communication` | Presents plans, reports, or mocks as readable HTML. | Yes |
| `writing-for-agents` | Writes skills, `AGENTS.md`, and `CLAUDE.md`. | Yes |
| `technical-writing` | Applies a layered technical-writing standard to docs, RFCs, and PRs. | No |
| `unslop` | Cuts AI tells from writing. | Yes |
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

These come from the paid animations.dev course and live in the private [`adelrodriguez/private-skills`](https://github.com/adelrodriguez/private-skills) repo, which has a script to refresh them from the course. That repo leaves out `animate`, `animation-performance`, and `animation-vocabulary`, because the course versions match Emil Kowalski's public ones listed under UI and design.

| Skill | Use | Auto |
| --- | --- | --- |
| `css-animations` | Animates with CSS transitions, keyframes, transforms, and `clip-path`. | Yes |
| `motion-react` | Builds and debugs animations with Motion for React. | Yes |
| `gesture-ui` | Builds drag, swipe, and sheet interactions that track the finger. | Yes |
| `scroll-animations` | Builds scroll-triggered and scroll-driven animation. | Yes |
| `animation-accessibility` | Adds reduced-motion variants for every animation. | Yes |
| `debug-animation` | Diagnoses why an animation feels off before changing code. | Yes |
| `motion-brief` | Interviews you about an animation until the brief has no blanks. | Yes |
| `pick-ui-library` | Picks the animation or UI library for a task. | Yes |
| `prototype-ui` | Builds several different versions of a UI behind a live picker. Renamed so it does not clash with `prototype`. | No |
| `find-animation-opportunities` | Finds the few places where motion would help. | No |
| `improve-animations` | Audits a codebase's motion and writes plans another agent can run. | No |
| `review-animations` | Reviews animation code against a high craft bar. | No |
