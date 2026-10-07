#!/usr/bin/env node
// Blocks until a pull request needs attention, then prints one digest and exits.
// Usage: node watch-pr.mjs [pr ...] [options]   (run with --help for details)

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const HELP = `watch-pr: wait for a GitHub PR to need attention, then print a digest.

Usage: node watch-pr.mjs [<pr> ...] [options]

  <pr>                 PR number or URL. Defaults to the current branch's PR.
                       Pass several to watch a stack or a batch at once.

Options:
  --repo <owner/name>  Repository for bare PR numbers (default: current repo).
  --expect-head <sha>  After a push: ignore the PR until its head is <sha>.
  --timeout <dur>      Give up and exit 2 after this long (default 25m).
  --interval <dur>     Poll interval (default 30s).
  --stall <dur>        Report STALLED when CI is done and a review bot has not
                       reviewed the head commit for this long (default 15m).
  --require <bots>     Comma-separated review bots that must approve
                       (pullfrog, codex, coderabbit, greptile, or a login).
                       Default: every known bot that has engaged on the PR.
                       Use "none" to require CI only.
  --once               Print the current status and exit without waiting.
  --reset              Forget what was already reported for these PRs.
  --self <login>       Login whose agent-authored posts are ignored
                       (default: the authenticated gh user).

Exit codes:
  0  Something to act on, or a terminal state (DONE, STALLED, CLOSED).
  2  Timed out with nothing new. Run the same command again.
  1  Error (bad arguments, gh failures). Details on stderr.

Durations accept s, m, or h suffixes, for example 90s, 25m, 2h.`;

// Review bots we know how to read. GraphQL reports bot logins without "[bot]".
const BOTS = {
  // Pullfrog reviews in a dispatched `pullfrog.yml` workflow, outside the PR's checks.
  pullfrog: { logins: ["pullfrog"], checks: ["pullfrog", "pullfrog-approval"], workflow: "pullfrog.yml", trigger: "@pullfrog review" },
  // Codex reacts 👍 instead of reviewing when it finds nothing; other bots use 👍 to mean "done".
  codex: { logins: ["chatgpt-codex-connector"], checks: [], trigger: "@codex review", thumbsUpApproves: true },
  coderabbit: { logins: ["coderabbitai"], checks: ["coderabbit"], trigger: "@coderabbitai review" },
  greptile: { logins: ["greptile-apps"], checks: ["greptile review"], trigger: "@greptileai review" },
};

// Authors whose comments never need action (deploy previews, release tooling).
const NOISE_LOGINS = new Set([
  "vercel", "netlify", "changeset-bot", "github-actions", "codecov", "graphite-app", "socket-security", "renovate", "dependabot",
]);

const POSITIVE_VERDICT = /no new issues found|didn'?t find any major issues|confidence score:?\s*5\s*\/\s*5/i;
const SCORED_VERDICT = /confidence score:?\s*\d\s*\/\s*5/i;
const RUN_FAILED = /\brun failed\b|this review did not happen|token expired or was revoked/i;
const PROGRESS_COMMENT = /leaping into action|^\s*-\s\[ \]|\bin progress\b|working on (it|this)|reviewing\.\.\.|⏳/im;
const CODEX_SUMMARY = "<!-- codex-pull-request-review-summary -->";
const AGENT_MARKER = /on behalf of /i;
const GRAPHITE_STACK = /app\.graphite\.(com|dev)\/github\/pr\//;
const BOT_TRIGGER = /^\s*@(pullfrog|codex|coderabbitai|greptileai)\b/i;

const FAILED_CONCLUSIONS = new Set(["FAILURE", "TIMED_OUT", "ACTION_REQUIRED", "STARTUP_FAILURE", "CANCELLED", "STALE"]);
const FAILED_STATES = new Set(["FAILURE", "ERROR"]);
const PENDING_STATES = new Set(["PENDING", "EXPECTED"]);

const MAX_CONSECUTIVE_ERRORS = 6;

function parseArgs(argv) {
  const opts = { prs: [], timeout: "25m", interval: "30s", stall: "15m" };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const value = () => {
      if (i + 1 >= argv.length) fail(`${arg} needs a value`);
      return argv[++i];
    };
    switch (arg) {
      case "-h": case "--help": console.log(HELP); process.exit(0);
      case "--repo": opts.repo = value(); break;
      case "--expect-head": opts.expectHead = value().toLowerCase(); break;
      case "--timeout": opts.timeout = value(); break;
      case "--interval": opts.interval = value(); break;
      case "--stall": opts.stall = value(); break;
      case "--require": opts.require = value(); break;
      case "--self": opts.self = value(); break;
      case "--once": opts.once = true; break;
      case "--reset": opts.reset = true; break;
      default:
        if (arg.startsWith("-")) fail(`unknown option ${arg}`);
        opts.prs.push(arg);
    }
  }
  for (const key of ["timeout", "interval", "stall"]) opts[key] = parseDuration(opts[key], key);
  return opts;
}

function parseDuration(text, name) {
  const match = /^(\d+(?:\.\d+)?)(s|m|h)?$/.exec(String(text).trim());
  if (!match) fail(`--${name} must look like 30s, 25m or 2h`);
  return Number(match[1]) * { s: 1e3, m: 6e4, h: 36e5 }[match[2] ?? "s"];
}

function fail(message) {
  console.error(`watch-pr: ${message}`);
  process.exit(1);
}

function gh(args) {
  try {
    return execFileSync("gh", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 64 * 1024 * 1024 });
  } catch (error) {
    // gh exits non-zero when a GraphQL response carries errors, even with usable data.
    if (error.stdout?.trim().startsWith("{")) return error.stdout;
    throw new Error((error.stderr || error.message).trim());
  }
}

function resolveTargets(opts) {
  const defaultRepo = () => opts.repo ?? gh(["repo", "view", "--json", "nameWithOwner", "-q", ".nameWithOwner"]).trim();
  if (opts.prs.length === 0) {
    const url = gh(["pr", "view", "--json", "url", "-q", ".url"]).trim();
    opts.prs.push(url);
  }
  return opts.prs.map((ref) => {
    const url = /github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/.exec(ref);
    if (url) return { owner: url[1], name: url[2], number: Number(url[3]) };
    const bare = /^#?(\d+)$/.exec(ref);
    if (!bare) fail(`cannot read PR reference "${ref}"`);
    const [owner, name] = defaultRepo().split("/");
    return { owner, name, number: Number(bare[1]) };
  });
}

const QUERY = `
query($owner: String!, $name: String!, $number: Int!, $headRef: String!) {
  repository(owner: $owner, name: $name) {
    pullRequest(number: $number) {
      number title url state isDraft mergeable mergeStateStatus headRefName headRefOid
      author { login }
      baseRef { name compare(headRef: $headRef) { behindBy } }
      commits(last: 1) { nodes { commit { oid committedDate statusCheckRollup { contexts(first: 100) { nodes {
        __typename
        ... on CheckRun { name status conclusion title startedAt completedAt detailsUrl checkSuite { workflowRun { workflow { name } } } }
        ... on StatusContext { context state targetUrl createdAt }
      } } } } } }
      reviews(last: 60) { nodes { databaseId author { login } state body submittedAt url commit { oid } } }
      comments(last: 80) { nodes { databaseId author { login } body createdAt lastEditedAt url } }
      reactions(last: 50) { nodes { content createdAt user { login } } }
      reviewThreads(first: 100) { nodes {
        id isResolved isOutdated path line
        first: comments(first: 1) { nodes { databaseId author { login } body url } }
        last: comments(last: 1) { nodes { databaseId author { login } body createdAt } }
      } }
    }
  }
}`;

function fetchPr(target) {
  // compare() needs the head ref name, which we only know after a first fetch.
  target.headRefName ??= gh(["api", `repos/${target.owner}/${target.name}/pulls/${target.number}`, "-q", ".head.ref"]).trim();
  const out = gh(["api", "graphql", "-f", `query=${QUERY}`, "-F", `owner=${target.owner}`, "-F", `name=${target.name}`,
    "-F", `number=${target.number}`, "-f", `headRef=${target.headRefName}`]);
  const body = JSON.parse(out);
  const pr = body.data?.repository?.pullRequest;
  if (!pr) throw new Error(body.errors?.map((e) => e.message).join("; ") || "empty GraphQL response");
  target.headRefName = pr.headRefName;
  return pr;
}

// Bots whose review workflow is running for this PR right now. Only asked of bots
// that review outside the PR's checks and have already engaged with it.
function fetchBotRuns(target, pr) {
  const running = new Set();
  const authors = new Set([...pr.reviews.nodes, ...pr.comments.nodes].map((n) => login(n.author)));
  for (const [key, bot] of Object.entries(BOTS)) {
    if (!bot.workflow || !bot.logins.some((l) => authors.has(l))) continue;
    const titles = gh(["api", `repos/${target.owner}/${target.name}/actions/runs?status=in_progress&per_page=30`,
      "-q", `.workflow_runs[] | select(.path | endswith("/${bot.workflow}")) | .display_title`]);
    if (titles.split("\n").some((t) => new RegExp(`#${target.number}\\b`).test(t))) running.add(key);
  }
  return running;
}

const login = (actor) => (actor?.login ?? "ghost").replace(/\[bot\]$/, "");
const short = (sha) => (sha ?? "").slice(0, 7);
const sameCommit = (a, b) => !!a && !!b && (a.startsWith(b) || b.startsWith(a)) && Math.min(a.length, b.length) >= 7;
const reviewedCommit = (body) => /reviewed commit:?\**:?\s*`([0-9a-f]{7,40})`|commit `([0-9a-f]{7,40})`|reviewed `([0-9a-f]{7,40})`/i.exec(body ?? "")?.slice(1).find(Boolean);
const clip = (text, max) => {
  // Bot bodies carry hidden metadata and logo markup; keep only readable text.
  const flat = (text ?? "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<details>\s*<summary>[^<]*About [^<]*<\/summary>[\s\S]*?<\/details>/gi, "")
    .replace(/<sup>[\s\S]*?<\/sup>/g, "")
    .replace(/<\/?(picture|source|img|details|summary|br|sub|p|div|a)\b[^>]*>/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return flat.length > max ? `${flat.slice(0, max)}… [${flat.length - max} more chars]` : flat;
};

function botFor(name) {
  return Object.entries(BOTS).find(([key, bot]) => key === name || bot.logins.includes(name))?.[0];
}

// Turns one GraphQL snapshot into a status object plus a set of actionable keys.
// Keys identify things the agent must act on; a key seen before is never re-reported.
function analyze(pr, opts, self, now, botRuns = new Set()) {
  const head = pr.headRefOid;
  const commit = pr.commits.nodes[0]?.commit;
  const headDate = Date.parse(commit?.committedDate ?? 0);
  // A re-run leaves the old run in the rollup; only the newest run per check counts.
  const newest = new Map();
  for (const c of commit?.statusCheckRollup?.contexts.nodes ?? []) {
    const name = c.__typename === "CheckRun" ? c.name : c.context;
    const at = Date.parse(c.startedAt ?? c.createdAt ?? 0) || 0;
    if (!newest.has(name) || at >= newest.get(name).at) newest.set(name, { at, c });
  }
  const contexts = [...newest.values()].map((v) => v.c);
  const items = [];
  const add = (key, kind, text, info = false) => items.push({ key, kind, text, info });

  const isAgentPost = (author, body) => author === self && (AGENT_MARKER.test(body ?? "") || BOT_TRIGGER.test(body ?? "") || !body?.trim());
  const isNoise = (author) => NOISE_LOGINS.has(author);

  if (opts.expectHead && !sameCommit(head, opts.expectHead)) {
    return { pr, head, waitingForHead: true, items, summary: `waiting for head ${short(opts.expectHead)} (PR head is still ${short(head)})` };
  }
  if (pr.state !== "OPEN") {
    add(`closed:${pr.state}`, "CLOSED", `PR is ${pr.state}.`);
    return { pr, head, terminal: pr.state, items, summary: pr.state };
  }

  // Checks. Review-bot checks report reviewer progress, not CI health.
  const botChecks = new Map();
  const botVerdictChecks = new Map(); // bot -> failed check that holds back approval
  const checks = { passed: 0, failed: [], pending: [] };
  let lastCompleted = 0;
  for (const c of contexts) {
    const name = c.__typename === "CheckRun" ? c.name : c.context;
    const bot = Object.entries(BOTS).find(([, b]) => b.checks.some((n) => n.toLowerCase() === name.toLowerCase()))?.[0];
    const pending = c.__typename === "CheckRun" ? c.status !== "COMPLETED" : PENDING_STATES.has(c.state);
    if (c.completedAt) lastCompleted = Math.max(lastCompleted, Date.parse(c.completedAt));
    if (bot) {
      if (!pending && FAILED_CONCLUSIONS.has(c.conclusion)) botVerdictChecks.set(bot, `${name}: ${c.title ?? c.conclusion}`)
      if (botChecks.get(bot) !== "running") botChecks.set(bot, pending ? "running" : (c.conclusion ?? c.state));
      continue;
    }
    if (pending) checks.pending.push(name);
    else if (FAILED_CONCLUSIONS.has(c.conclusion) || FAILED_STATES.has(c.state)) {
      checks.failed.push(name);
      const workflow = c.checkSuite?.workflowRun?.workflow?.name;
      const url = c.detailsUrl ?? c.targetUrl ?? "";
      const run = /\/actions\/runs\/(\d+)/.exec(url)?.[1];
      const logs = run ? `\n  logs: gh run view ${run} --log-failed --repo ${pr.url.split("/").slice(3, 5).join("/")}` : "";
      add(`check:${name}:${head}`, "CHECK FAILED", `${workflow ? `${workflow} / ` : ""}${name}: ${c.conclusion ?? c.state}\n  ${url}${logs}`);
    } else checks.passed++;
  }

  // Merge state.
  if (pr.mergeable === "CONFLICTING") add(`conflict:${head}`, "CONFLICT", `PR conflicts with ${pr.baseRef?.name}. Rebase onto it and force-push with --force-with-lease.`);
  const behind = pr.baseRef?.compare?.behindBy ?? (pr.mergeStateStatus === "BEHIND" ? 1 : 0);
  if (behind > 0 && pr.mergeable !== "CONFLICTING") add(`behind:${head}`, "BASE MOVED", `${pr.baseRef?.name} is ${behind} commit(s) ahead of this branch. Rebase (never merge) and force-push with --force-with-lease.`);

  // Review-bot verdicts on the head commit.
  const verdicts = new Map(); // bot -> [{at, positive, source}]
  const activity = new Map(); // bot -> latest activity time on this head
  const failedRuns = new Map(); // bot -> latest failed-run notice on this head
  const engaged = new Set([...botChecks.keys()]);
  const note = (bot, at, positive, source) => {
    engaged.add(bot);
    if (!verdicts.has(bot)) verdicts.set(bot, []);
    verdicts.get(bot).push({ at, positive, source });
  };

  for (const r of pr.reviews.nodes) {
    const author = login(r.author);
    const bot = botFor(author);
    if (bot) engaged.add(bot);
    if (isAgentPost(author, r.body) || isNoise(author)) continue;
    if (!sameCommit(r.commit?.oid, head)) continue;
    const positive = r.state === "APPROVED" || POSITIVE_VERDICT.test(r.body);
    if (bot) note(bot, Date.parse(r.submittedAt), positive, `review ${r.state.toLowerCase()}`);
    else if (r.state === "APPROVED") note(author, Date.parse(r.submittedAt), true, "review approved");
    if (r.body?.trim() || r.state !== "COMMENTED") {
      add(`review:${r.databaseId}`, positive ? "REVIEW (clean)" : "REVIEW", `${author} ${r.state} on ${short(r.commit?.oid)} (${r.submittedAt})\n${clip(r.body, positive ? 600 : 4000) || "(no body; see threads)"}\n  ${r.url}`, positive);
    }
  }

  for (const c of pr.comments.nodes) {
    const author = login(c.author);
    const bot = botFor(author);
    if (bot) engaged.add(bot);
    if (isAgentPost(author, c.body) || isNoise(author) || c.body?.includes(CODEX_SUMMARY)) continue;
    if (bot) {
      // Bots edit one progress comment in place; only its final form is news.
      // Some bots (Greptile) rewrite one summary per review, so an edit after the head commit is a new verdict.
      if (PROGRESS_COMMENT.test(c.body)) continue;
      const sha = reviewedCommit(c.body);
      const at = Date.parse(c.lastEditedAt ?? c.createdAt);
      if (sha ? !sameCommit(sha, head) : at < headDate) continue;
      const clean = POSITIVE_VERDICT.test(c.body);
      // Status notices are news but not a verdict on the code; a failed run ends the bot's activity.
      if (sha || clean || SCORED_VERDICT.test(c.body)) note(bot, at, clean, "comment");
      else if (RUN_FAILED.test(c.body)) failedRuns.set(bot, Math.max(failedRuns.get(bot) ?? 0, at));
      add(`comment:${c.databaseId}:${c.lastEditedAt ?? "final"}`, clean ? "BOT COMMENT (clean)" : "BOT COMMENT", `${author} (${c.createdAt})\n${clip(c.body, clean ? 600 : 3000)}\n  ${c.url}`, clean);
      continue;
    }
    // Your own unmarked comments are instructions only if they are newer than the head commit.
    if (author === self && (Date.parse(c.createdAt) < headDate || GRAPHITE_STACK.test(c.body))) continue;
    add(`comment:${c.databaseId}`, author === self ? "COMMENT FROM YOU (not agent-marked)" : "COMMENT", `${author} (${c.createdAt})\n${clip(c.body, 3000)}\n  ${c.url}`);
  }

  for (const r of pr.reactions.nodes) {
    const bot = botFor(login(r.user));
    if (!bot) continue;
    engaged.add(bot);
    const at = Date.parse(r.createdAt);
    if (at < headDate) continue;
    activity.set(bot, Math.max(activity.get(bot) ?? 0, at));
    if (r.content === "THUMBS_UP" && BOTS[bot].thumbsUpApproves) {
      note(bot, at, true, "👍 reaction");
      add(`reaction:${bot}:+1:${head}`, "BOT APPROVAL", `${bot} reacted 👍 to the PR after the head commit (${r.createdAt}).`, true);
    }
  }

  // Unresolved threads whose last word is not ours need a fix or a reply.
  let unresolved = 0;
  let awaitingResolve = 0;
  for (const t of pr.reviewThreads.nodes) {
    if (t.isResolved) continue;
    unresolved++;
    const first = t.first.nodes[0];
    const last = t.last.nodes[0];
    const lastAuthor = login(last?.author);
    if (isAgentPost(lastAuthor, last?.body)) { awaitingResolve++; continue; }
    if (isNoise(login(first?.author))) continue;
    const reply = last && last.databaseId !== first?.databaseId ? `\n  latest reply by ${lastAuthor}: ${clip(last.body, 1500)}` : "";
    add(`thread:${t.id}:${last?.databaseId}`, "THREAD", `${t.path}${t.line ? `:${t.line}` : ""}${t.isOutdated ? " (outdated)" : ""} by ${login(first?.author)}\n${clip(first?.body, 3000)}${reply}\n  ${first?.url}\n  thread id ${t.id}; reply to comment id ${first?.databaseId}`);
  }

  // Which bots must approve?
  const required = opts.require === "none" ? [] : opts.require
    ? opts.require.split(",").map((s) => s.trim()).filter(Boolean).map((s) => botFor(s) ?? s)
    : [...engaged].filter((b) => BOTS[b]);
  const bots = required.map((bot) => {
    const list = (verdicts.get(bot) ?? []).sort((a, b) => a.at - b.at);
    const latest = list.at(-1);
    const failedAt = failedRuns.get(bot) ?? 0;
    const running = botChecks.get(bot) === "running" || botRuns.has(bot) || (activity.get(bot) ?? 0) > Math.max(latest?.at ?? 0, failedAt);
    const state = latest?.positive && latest.at > failedAt ? "approved" : latest && latest.at > failedAt ? "findings"
      : running ? "reviewing" : failedAt ? "run failed" : latest ? (latest.positive ? "approved" : "findings") : "no review on head";
    return { bot, state, latest };
  });

  const ciDone = checks.pending.length === 0;
  const ciGreen = ciDone && checks.failed.length === 0;
  const clean = pr.mergeable !== "CONFLICTING" && behind === 0;
  const allApproved = bots.every((b) => b.state === "approved");
  const done = ciGreen && clean && unresolved === 0 && allApproved && (required.length > 0 || opts.require === "none");
  if (done) add(`done:${head}`, "DONE", `CI green, ${required.length ? `approved on head by ${required.join(", ")}` : "no review bots required"}, no unresolved threads, up to date with ${pr.baseRef?.name}.`);

  // Stalled: CI settled, nothing new from a required bot on this head for --stall.
  const quietSince = Math.max(headDate, lastCompleted, ...[...activity.values()]);
  if (!done && ciGreen && now - quietSince > opts.stall) {
    const silent = required.length === 0 && opts.require !== "none"
      ? ["(no review bot has engaged)"]
      : bots.filter((b) => b.state === "no review on head" || b.state === "run failed").map((b) => b.bot);
    for (const bot of silent) {
      const verdict = botVerdictChecks.get(bot);
      const hint = verdict
        ? `Its check says "${verdict}" but no review is on the head commit, so the review may have failed to publish. Read its latest run log for the findings before re-requesting.`
        : BOTS[bot] ? `Post "${BOTS[bot].trigger}" (agent-marked) to request it, then run this again.` : "Check whether this repo has a review bot, or rerun with --require none.";
      add(`stalled:${bot}:${head}`, "STALLED", `${bot} has not reviewed ${short(head)} after ${Math.round((now - quietSince) / 6e4)}m of quiet. ${hint}`);
    }
  }

  const summary = [
    `head ${short(head)}${pr.isDraft ? " (draft)" : ""}`,
    `checks ${checks.passed} passed, ${checks.failed.length} failed, ${checks.pending.length} pending${checks.pending.length ? ` (${checks.pending.slice(0, 4).join(", ")}${checks.pending.length > 4 ? ", …" : ""})` : ""}`,
    `reviewers: ${bots.length ? bots.map((b) => `${b.bot} ${b.state}`).join(", ") : opts.require === "none" ? "none required" : "none engaged yet"}`,
    `threads: ${unresolved} unresolved${awaitingResolve ? ` (${awaitingResolve} answered by you, resolve them)` : ""}`,
    `base: ${behind ? `${behind} behind ${pr.baseRef?.name}` : `up to date with ${pr.baseRef?.name}`}${pr.mergeable === "CONFLICTING" ? ", CONFLICTING" : ""}`,
  ].join(" · ");
  return { pr, head, items, done, summary };
}

function statePath(target) {
  const dir = join(process.env.XDG_STATE_HOME || join(homedir(), ".local", "state"), "monitor-pr");
  mkdirSync(dir, { recursive: true });
  return join(dir, `${target.owner}__${target.name}__${target.number}.json`);
}

function loadSeen(target) {
  try { return new Set(JSON.parse(readFileSync(statePath(target), "utf8")).seen); } catch { return new Set(); }
}

function saveSeen(target, keys) {
  writeFileSync(statePath(target), JSON.stringify({ seen: [...keys], savedAt: new Date().toISOString() }));
}

function report(results, opts, kind) {
  const lines = [`RESULT: ${kind}`];
  for (const { target, analysis, fresh } of results) {
    const { pr } = analysis;
    lines.push("", `## ${target.owner}/${target.name}#${target.number}${pr ? ` ${pr.title}` : ""}`, analysis.summary);
    for (const item of fresh) lines.push("", `[${item.kind}] ${item.text}`);
  }
  const hints = {
    ACTION: "Next: act on the items above (verify each bot finding against the code first), push, then rerun with --expect-head $(git rev-parse HEAD).",
    DONE: "Next: report to the user.",
    STALLED: "Next: follow the STALLED hint, then rerun this command.",
    CLOSED: "Next: stop monitoring and tell the user.",
    TIMEOUT: "Nothing new. Run the same command again to keep waiting.",
    STATUS: "Nothing new since the last report.",
  };
  lines.push("", hints[kind]);
  console.log(lines.join("\n"));
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const targets = resolveTargets(opts);
  const self = opts.self ?? gh(["api", "user", "-q", ".login"]).trim();
  if (opts.reset) for (const t of targets) rmSync(statePath(t), { force: true });

  const started = Date.now();
  let errors = 0;
  for (;;) {
    const results = [];
    try {
      for (const target of targets) {
        const pr = fetchPr(target);
        const analysis = analyze(pr, opts, self, Date.now(), fetchBotRuns(target, pr));
        const seen = loadSeen(target);
        const fresh = analysis.items.filter((i) => !seen.has(i.key));
        results.push({ target, analysis, seen, fresh });
      }
      errors = 0;
    } catch (error) {
      errors++;
      console.error(`watch-pr: poll failed (${errors}/${MAX_CONSECUTIVE_ERRORS}): ${error.message}`);
      if (errors >= MAX_CONSECUTIVE_ERRORS) fail("giving up after repeated GitHub errors; check `gh auth status` and `gh api rate_limit`.");
      await sleep(Math.min(opts.interval * 2 ** errors, 5 * 6e4));
      continue;
    }

    const fresh = results.flatMap((r) => r.fresh);
    const kinds = new Set(fresh.map((i) => i.kind));
    const allDone = results.every((r) => r.analysis.done || r.analysis.terminal);
    // Clean verdicts and approvals are progress, not work: they ride along with the next real report.
    const actionable = fresh.filter((i) => !i.info && !["DONE", "STALLED", "CLOSED"].includes(i.kind));
    const humanSpoke = actionable.some((i) => i.kind.startsWith("COMMENT"));
    let kind = null;
    if (allDone && fresh.length) kind = humanSpoke ? "ACTION" : kinds.has("DONE") ? "DONE" : "CLOSED";
    else if (actionable.length) kind = "ACTION";
    else if (kinds.has("STALLED")) kind = "STALLED";
    else if (kinds.has("CLOSED")) kind = "ACTION";

    if (kind || opts.once) {
      for (const r of results) saveSeen(r.target, new Set([...r.seen, ...r.analysis.items.map((i) => i.key)]));
      report(results, opts, kind ?? "STATUS");
      process.exit(0);
    }
    if (Date.now() - started + opts.interval > opts.timeout) {
      report(results.map((r) => ({ ...r, fresh: [] })), opts, "TIMEOUT");
      process.exit(2);
    }
    await sleep(opts.interval);
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

main().catch((error) => fail(error.stack || error.message));
