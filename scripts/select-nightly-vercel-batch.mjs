import fs from "node:fs/promises";

// Factory target selection chain (Phase 0):
//   1. TARGET_REPOSITORY_IN set  -> one manual target (workflow_dispatch input).
//   2. VERCEL_TOKEN set          -> the existing Vercel batch (behavior unchanged).
//   3. factory/targets.json      -> configured static targets.
//   4. nothing configured        -> has_targets=false plus a visible job summary,
//                                   exit 0. A missing config must read as a notice,
//                                   never a silent red, and never a fake green.
// FACTORY_TARGETS_FILE overrides the targets file location (tests).

const outputFile = process.env.GITHUB_OUTPUT ?? "nightly-batch.out";
const summaryFile = process.env.GITHUB_STEP_SUMMARY;

const emit = async (include) => {
  const hasTargets = include.length > 0;
  await fs.writeFile(
    outputFile,
    `matrix=${JSON.stringify({ include })}\nhas_targets=${hasTargets}\n`,
  );
  return hasTargets;
};

const noTargets = async (reason) => {
  await emit([]);
  if (summaryFile) {
    await fs.appendFile(
      summaryFile,
      `## Nightly factory\n\nNo factory targets configured (${reason}). Skipping - this is a notice, not a failure.\n`,
    );
  }
  console.log(JSON.stringify({ has_targets: false, reason: `no factory targets configured (${reason})` }));
};

const manual = process.env.TARGET_REPOSITORY_IN;
if (manual) {
  const branch = process.env.TARGET_BRANCH_IN || "main";
  const project = manual.split("/").pop();
  const include = [{ project, repository: manual, branch, state: "MANUAL", priority: 0 }];
  await emit(include);
  console.log(JSON.stringify({ source: "manual", selected: include }, null, 2));
  process.exit(0);
}

const token = process.env.VERCEL_TOKEN;
const teamId = process.env.VERCEL_TEAM_ID;

if (!token) {
  const targetsFile = process.env.FACTORY_TARGETS_FILE || "factory/targets.json";
  let configured = [];
  try {
    const raw = JSON.parse(await fs.readFile(targetsFile, "utf8"));
    configured = Array.isArray(raw.targets) ? raw.targets : [];
  } catch {}
  const include = configured
    .filter((t) => t && typeof t.repository === "string" && t.repository.includes("/"))
    .map((t) => ({
      project: t.project || t.repository.split("/").pop(),
      repository: t.repository,
      branch: t.branch || "main",
      state: "CONFIG",
      priority: 0,
    }));
  if (!include.length) {
    await noTargets("no TARGET_REPOSITORY_IN, no VERCEL_TOKEN, targets file missing or empty");
    process.exit(0);
  }
  await emit(include);
  console.log(JSON.stringify({ source: targetsFile, selected: include }, null, 2));
  process.exit(0);
}

// Branch 2: the existing Vercel batch, unchanged.
const headers = { Authorization: `Bearer ${token}` };
let projects = [];
let until;
do {
  const url = new URL("https://api.vercel.com/v9/projects");
  url.searchParams.set("limit", "100");
  if (teamId) url.searchParams.set("teamId", teamId);
  if (until) url.searchParams.set("until", String(until));
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`Vercel projects request failed: ${response.status}`);
  const body = await response.json();
  projects.push(...(body.projects ?? []));
  until = body.pagination?.next;
} while (until);

const candidates = projects
  .map((project) => {
    const git = project.link?.repo ? `${project.link.org}/${project.link.repo}` : null;
    const branch = project.link?.productionBranch ?? "main";
    const latest = project.latestDeployments?.[0] ?? project.targets?.production;
    const state = latest?.readyState ?? "UNKNOWN";
    const priority = ["ERROR", "CANCELED"].includes(state) ? 0 : state === "READY" ? 2 : 1;
    return { project: project.name, repository: git, branch, state, priority };
  })
  .filter((item) => item.repository)
  .sort((a, b) => a.priority - b.priority || a.project.localeCompare(b.project));

const distinct = [];
const seen = new Set();
for (const item of candidates) {
  if (seen.has(item.repository)) continue;
  seen.add(item.repository);
  distinct.push(item);
}

const day = Math.floor(Date.now() / 86400000);
const offset = distinct.length ? (day * 5) % distinct.length : 0;
const rotated = [...distinct.slice(offset), ...distinct.slice(0, offset)];
const batch = rotated.slice(0, 5);

if (!(await emit(batch))) await noTargets("Vercel batch selection produced no eligible repositories");
console.log(JSON.stringify({ discovered: projects.length, eligibleRepositories: distinct.length, selected: batch }, null, 2));
