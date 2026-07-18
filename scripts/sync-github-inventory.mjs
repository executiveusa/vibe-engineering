import { writeFile } from "node:fs/promises";

const owner = process.env.GITHUB_OWNER || "executiveusa";
const token = process.env.GITHUB_TOKEN;

if (!token) {
  console.error("GITHUB_TOKEN is required. Use an owner-controlled secret reference; never commit the token.");
  process.exit(1);
}

const headers = {
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${token}`,
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "vibe-engineering-registry-sync",
};

const repositories = [];
let page = 1;

while (true) {
  const url = new URL(`https://api.github.com/users/${owner}/repos`);
  url.searchParams.set("per_page", "100");
  url.searchParams.set("page", String(page));
  url.searchParams.set("sort", "full_name");
  url.searchParams.set("direction", "asc");

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`GitHub inventory failed: ${response.status} ${response.statusText}`);
  }

  const batch = await response.json();
  if (!Array.isArray(batch)) {
    throw new TypeError("GitHub returned an unexpected repository payload.");
  }

  repositories.push(...batch);
  if (batch.length < 100) break;
  page += 1;
}

const quote = (value) => JSON.stringify(value ?? "");
const generatedAt = new Date().toISOString();

const lines = [
  "inventory:",
  `  owner: ${quote(owner)}`,
  `  generated_at: ${quote(generatedAt)}`,
  `  repository_count: ${repositories.length}`,
  "  source: GitHub REST API",
  "  mode: read_only_metadata",
  "repositories:",
];

for (const repo of repositories) {
  lines.push(
    `  - repository: ${quote(repo.full_name)}`,
    `    visibility: ${quote(repo.visibility)}`,
    `    default_branch: ${quote(repo.default_branch)}`,
    `    archived: ${Boolean(repo.archived)}`,
    "    intake_status: INTAKE",
    "    classification: UNCLASSIFIED",
    "    audit_state: NOT_STARTED",
    "    commercial_state: UNKNOWN",
    "    production_state: UNKNOWN",
    "    ownership_state: OWNER_REPOSITORY_CONFIRMED",
    "    next_action: SCAN",
  );
}

await writeFile("registry/repositories.yaml", `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${repositories.length} repositories to registry/repositories.yaml`);
