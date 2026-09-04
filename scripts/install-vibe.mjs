#!/usr/bin/env node
import { cp, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const REPO = 'https://github.com/executiveusa/vibe-engineering';
const ROOT_FILES = ['AGENTS.md', 'ICMR.yaml', 'CONTEXT.md'];

function parseArgs(argv) {
  const options = { target: process.cwd(), force: false, skills: true };
  let positionalTargetSet = false;

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--force') options.force = true;
    else if (token === '--no-skills') options.skills = false;
    else if (token === '--target') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) throw new Error('Missing value for --target');
      options.target = value;
      positionalTargetSet = true;
      index += 1;
    } else if (!token.startsWith('--') && !positionalTargetSet) {
      options.target = token;
      positionalTargetSet = true;
    } else {
      throw new Error(`Unknown option: ${token}`);
    }
  }

  return options;
}

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

function projectName(target) {
  return path.basename(path.resolve(target)) || 'Vibe Project';
}

function coreFiles(name, mode) {
  return {
    'AGENTS.md': `# ${name} — Vibe Engineering law\n\n## Entry point\n\nRead this file, then \`ICMR.yaml\`, then \`CONTEXT.md\`.\n\n## Non-negotiable laws\n\n- Verify It Before Everything.\n- The filesystem is the source of truth. Agents are adapters, not architecture.\n- Inspect before changing. Reuse before adding. Specify before building.\n- Keep durable decisions and proof in files, not chat memory.\n- No agent soup. One walkable system. Any capable agent can use it.\n- Build one verifiable slice at a time.\n- Never expose secrets.\n- Preserve owner control of code, data, accounts, credentials, infrastructure, and documentation.\n- The builder cannot approve its own consequential release.\n- Never call work done without evidence and rollback.\n\n## Working rhythm\n\n\`INTENT → STANDARD → BUILD → CHECK → PROVE → DECIDE\`\n\nFor consequential software changes use:\n\n\`DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP\`\n\n## Skills\n\nPortable Vibe procedures live in \`.vibe/skills/\`. Use the smallest skill that fits the work.\n\nSource: ${REPO}\n`,
    'ICMR.yaml': `schemaVersion: 1\nmethod: Vibe Engineering / ICM\nproject:\n  name: ${JSON.stringify(name)}\n  mode: ${mode}\nentry:\n  order:\n    - AGENTS.md\n    - ICMR.yaml\n    - CONTEXT.md\nlifecycle:\n  - DEFINE\n  - PLAN\n  - BUILD\n  - VERIFY\n  - REVIEW\n  - SHIP\ndecisionContract:\n  - Intent\n  - Standard\n  - Evidence\npaths:\n  context: CONTEXT.md\n  proof: PROOF/\n  skills: .vibe/skills/\n  manifest: .vibe/manifest.json\nrelease:\n  humanFinalCall: true\n  requireProof: true\n  requireRollback: true\n`,
    'CONTEXT.md': `# Current context\n\n## Status\n\nVibe is installed. The next action is to describe the outcome you want, the standard it must meet, and the evidence that would prove it works.\n\n## Start here\n\n1. State the outcome in one sentence.\n2. Define what good looks like.\n3. Identify constraints and owner-only decisions.\n4. Choose the smallest verifiable slice.\n5. Put evidence in \`PROOF/\`.\n\n## Agent instruction\n\nFollow \`AGENTS.md\`. Verify It Before Everything.\n`,
  };
}

async function writeManagedFile(target, relativePath, content, force, report) {
  const destination = path.join(target, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  if (await exists(destination) && !force) {
    report.skipped.push(relativePath);
    return;
  }
  await writeFile(destination, content, 'utf8');
  report.written.push(relativePath);
}

export async function installVibe({ target, force = false, skills = true }, sourceRoot) {
  const root = path.resolve(target);
  await mkdir(root, { recursive: true });
  const entriesBeforeInstall = (await readdir(root)).filter((entry) => entry !== '.git');
  const mode = entriesBeforeInstall.length === 0 ? 'greenfield' : 'brownfield';
  const name = projectName(root);
  const report = { target: root, mode, written: [], skipped: [], skills: false };
  const files = coreFiles(name, mode);

  for (const relativePath of ROOT_FILES) {
    await writeManagedFile(root, relativePath, files[relativePath], force, report);
  }

  await mkdir(path.join(root, 'PROOF'), { recursive: true });
  await writeManagedFile(root, 'PROOF/README.md', '# Proof\n\nPut test output, screenshots, release evidence, and rollback proof here.\n', force, report);

  await mkdir(path.join(root, '.vibe'), { recursive: true });
  const packageJson = JSON.parse(await readFile(path.join(sourceRoot, 'package.json'), 'utf8'));
  await writeManagedFile(root, '.vibe/manifest.json', `${JSON.stringify({
    schemaVersion: 1,
    name: 'vibe-engineering',
    version: packageJson.version,
    source: REPO,
    installedAt: new Date().toISOString(),
    mode,
    canonicalEntry: ['AGENTS.md', 'ICMR.yaml', 'CONTEXT.md'],
    adapters: ['filesystem', 'claude-code', 'codex', 'cursor', 'opencode', 'cli', 'mcp', 'api'],
  }, null, 2)}\n`, true, report);

  await writeManagedFile(root, 'CLAUDE.md', '# Vibe Engineering\n\nRead `AGENTS.md`, then `ICMR.yaml`, then `CONTEXT.md`. Follow Vibe. Verify It Before Everything.\n', force, report);
  await writeManagedFile(root, '.cursor/rules/vibe.mdc', '---\ndescription: Vibe Engineering project law\nalwaysApply: true\n---\n\nRead AGENTS.md, then ICMR.yaml, then CONTEXT.md. Follow Vibe. Verify It Before Everything.\n', force, report);
  await writeManagedFile(root, '.vibe/OPENCODE.md', '# OpenCode adapter\n\nUse the repository filesystem as canonical context. Read `AGENTS.md → ICMR.yaml → CONTEXT.md`. Do not create a parallel agent architecture.\n', force, report);
  await writeManagedFile(root, '.vibe/CODEX.md', '# Codex adapter\n\nCodex should enter through the root `AGENTS.md`, then read `ICMR.yaml` and `CONTEXT.md`.\n', force, report);

  if (skills) {
    const sourceSkills = path.join(sourceRoot, 'skills');
    const destinationSkills = path.join(root, '.vibe', 'skills');
    if (await exists(destinationSkills) && !force) {
      report.skipped.push('.vibe/skills/');
    } else {
      await cp(sourceSkills, destinationSkills, { recursive: true, force: true });
      report.skills = true;
    }
  }

  const ownerControlledConflicts = report.skipped.filter((item) => ['AGENTS.md', 'ICMR.yaml', 'CONTEXT.md', 'CLAUDE.md', '.cursor/rules/vibe.mdc'].includes(item));
  if (ownerControlledConflicts.length > 0) {
    const notes = `# Vibe install notes\n\nVibe preserved owner-controlled files instead of overwriting them:\n\n${ownerControlledConflicts.map((item) => `- \`${item}\``).join('\n')}\n\nReview those files and add this entry instruction where appropriate:\n\n\`Read AGENTS.md → ICMR.yaml → CONTEXT.md. Follow Vibe. Verify It Before Everything.\`\n\nDo not replace existing project law blindly. Merge by intent.\n`;
    await writeManagedFile(root, '.vibe/INSTALL-NOTES.md', notes, true, report);
  }

  return report;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const sourceRoot = path.resolve(scriptDir, '..');
  const report = await installVibe(options, sourceRoot);
  console.log('Vibe Engineering installed.');
  console.log(`Target: ${report.target}`);
  console.log(`Mode: ${report.mode}`);
  console.log(`Written: ${report.written.length}`);
  if (report.skipped.length) console.log(`Preserved existing files: ${report.skipped.join(', ')}`);
  console.log('Next: tell your agent — "Read AGENTS.md. Follow Vibe. Verify It Before Everything."');
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedPath && invokedPath === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`Vibe install failed: ${error.message}`);
    process.exitCode = 1;
  });
}
