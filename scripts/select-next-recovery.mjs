import fs from 'node:fs';

const queuePath = process.env.VIBE_RECOVERY_QUEUE || 'registry/vercel-recovery-queue.json';
const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
const requested = process.env.VIBE_PROJECT?.trim();

const eligible = queue.projects.filter((item) => item.status === 'pending' && item.repository);
const selected = requested
  ? eligible.find((item) => item.project === requested)
  : eligible.find((item, index, list) =>
      list.findIndex((candidate) => candidate.repository.toLowerCase() === item.repository.toLowerCase()) === index,
    );

if (!selected) {
  console.error(requested ? `No pending recovery target named ${requested}` : 'No pending Git-backed recovery target remains.');
  process.exit(2);
}

const output = {
  ...selected,
  slug: selected.project.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase(),
  owner: selected.repository.split('/')[0],
  repo: selected.repository.split('/')[1],
};

if (process.env.GITHUB_OUTPUT) {
  for (const [key, value] of Object.entries(output)) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value ?? ''}\n`);
  }
}

process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
