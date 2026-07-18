import fs from "node:fs/promises";

const token = process.env.VERCEL_TOKEN;
const teamId = process.env.VERCEL_TEAM_ID;
if (!token) throw new Error("VERCEL_TOKEN is required");

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

await fs.writeFile(process.env.GITHUB_OUTPUT ?? "nightly-batch.out", `matrix=${JSON.stringify({ include: batch })}\n`);
console.log(JSON.stringify({ discovered: projects.length, eligibleRepositories: distinct.length, selected: batch }, null, 2));
