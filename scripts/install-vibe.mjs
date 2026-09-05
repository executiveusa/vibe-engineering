#!/usr/bin/env node
import { cp, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const REPO = 'https://github.com/executiveusa/vibe-engineering';
const HOUSE_SKILL_URL = `${REPO}/raw/refs/heads/main/skills/vibe-engineering/SKILL.md`;
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
    'AGENTS.md': `# ${name} — Vibe Engineering house law\n\n## Entry point\n\nRead this file, then \`ICMR.yaml\`, then \`CONTEXT.md\`, then \`.vibe/VIBE_HOUSE_STANDARD.md\`. For material work, use \`.vibe/skills/vibe-engineering/SKILL.md\` as the canonical router when skills are installed. Refresh from the canonical upstream before material work when reachable.\n\n## Non-negotiable laws\n\n- Verify It Before Everything.\n- The filesystem is the source of truth. Agents are adapters, not architecture.\n- Inspect before changing. Reuse before adding. Specify before building.\n- Keep durable decisions and proof in files, not chat memory.\n- No agent soup. One walkable system. Any capable agent can use it.\n- Build one verifiable slice at a time.\n- Never expose secrets.\n- Preserve owner control of code, data, accounts, credentials, infrastructure, and documentation.\n- The builder cannot approve its own consequential release.\n- Judge returns only SHIP or HOLD.\n- Never call work done without evidence and rollback.\n\n## House architecture\n\n\`VIBE GOVERNANCE → ICM CONTEXT → ARTIFACT LIFECYCLE → ORCHESTRATOR → WORKERS\`\n\nThe canonical artifact lifecycle is:\n\n\`INTENT → SPEC → PLAN → BUILD → PROOF → COUNCIL → JUDGE → SHIP → OPERATE\`\n\nFor every material decision record:\n\n\`INTENT → STANDARD → EVIDENCE\`\n\n## Skills\n\nPortable Vibe procedures live in \`.vibe/skills/\` when installed. Start with \`.vibe/skills/vibe-engineering/SKILL.md\`; it routes to smaller skills only when needed. The global method contract is always available at \`.vibe/VIBE_HOUSE_STANDARD.md\`.\n\n## Visual + formatting law\n\nSemantic stage colors live in \`.vibe/stage-system.yaml\`. Formatter rules normalize text/code but never count as behavioral or production proof.\n\nCanonical upstream: ${REPO}\nCanonical House Skill: ${HOUSE_SKILL_URL}\n`,
    'ICMR.yaml': `schemaVersion: 2\nmethod: Vibe Engineering / ICM\nproject:\n  name: ${JSON.stringify(name)}\n  mode: ${mode}\nentry:\n  order:\n    - AGENTS.md\n    - ICMR.yaml\n    - CONTEXT.md\n    - .vibe/VIBE_HOUSE_STANDARD.md\nhouseArchitecture:\n  governance: Vibe Engineering\n  context: ICM\n  standard: .vibe/VIBE_HOUSE_STANDARD.md\n  router: .vibe/skills/vibe-engineering/SKILL.md\n  visualTokens: .vibe/stage-system.yaml\nlifecycle:\n  - INTENT\n  - SPEC\n  - PLAN\n  - BUILD\n  - PROOF\n  - COUNCIL\n  - JUDGE\n  - SHIP\n  - OPERATE\ndecisionContract:\n  - Intent\n  - Standard\n  - Evidence\npaths:\n  context: CONTEXT.md\n  proof: PROOF/\n  houseStandard: .vibe/VIBE_HOUSE_STANDARD.md\n  skills: .vibe/skills/\n  manifest: .vibe/manifest.json\nrelease:\n  humanFinalCall: true\n  requireProof: true\n  requireRollback: true\n`,
    'CONTEXT.md': `# Current context\n\n## Status\n\nVibe House is installed. Start at INTENT unless the repository already contains evidence that a later stage is current.\n\n## Start here\n\n1. Read \`.vibe/VIBE_HOUSE_STANDARD.md\` and refresh from canonical upstream when reachable.\n2. State the measurable outcome and target.\n3. Record constraints, proof, commercial value, ownership, and rollback.\n4. Create or confirm the SPEC before implementation.\n5. Build one independently verifiable slice.\n6. Put evidence in \`PROOF/\` and require independent review before consequential release.\n\n## Agent instruction\n\nRead \`AGENTS.md\`, then \`ICMR.yaml\`, then this file, then \`.vibe/VIBE_HOUSE_STANDARD.md\`. Use \`.vibe/skills/vibe-engineering/SKILL.md\` as the house router when present. Verify It Before Everything.\n`,
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
    schemaVersion: 2,
    name: 'vibe-engineering',
    version: packageJson.version,
    source: REPO,
    houseStandard: '.vibe/VIBE_HOUSE_STANDARD.md',
    houseSkill: '.vibe/skills/vibe-engineering/SKILL.md',
    stageSystem: '.vibe/stage-system.yaml',
    installedAt: new Date().toISOString(),
    mode,
    canonicalEntry: ['AGENTS.md', 'ICMR.yaml', 'CONTEXT.md', '.vibe/VIBE_HOUSE_STANDARD.md'],
    lifecycle: ['INTENT', 'SPEC', 'PLAN', 'BUILD', 'PROOF', 'COUNCIL', 'JUDGE', 'SHIP', 'OPERATE'],
    adapters: ['filesystem', 'claude-code', 'codex', 'cursor', 'opencode', 'cli', 'mcp', 'api'],
  }, null, 2)}\n`, true, report);

  const stageSystem = await readFile(path.join(sourceRoot, '_config', 'stage-system.yaml'), 'utf8');
  await writeManagedFile(root, '.vibe/stage-system.yaml', stageSystem, force, report);

  const houseStandard = await readFile(
    path.join(sourceRoot, 'factory', 'icm', 'template', 'shared', 'VIBE_HOUSE_STANDARD.md'),
    'utf8',
  );
  await writeManagedFile(root, '.vibe/VIBE_HOUSE_STANDARD.md', houseStandard, force, report);

  await writeManagedFile(root, 'CLAUDE.md', '# Vibe Engineering\n\nRead `AGENTS.md`, then `ICMR.yaml`, then `CONTEXT.md`, then `.vibe/VIBE_HOUSE_STANDARD.md`. Use `.vibe/skills/vibe-engineering/SKILL.md` as the canonical house router when present. Refresh upstream first when reachable. Verify It Before Everything.\n', force, report);
  await writeManagedFile(root, '.cursor/rules/vibe.mdc', '---\ndescription: Vibe Engineering house law\nalwaysApply: true\n---\n\nRead AGENTS.md, then ICMR.yaml, then CONTEXT.md, then .vibe/VIBE_HOUSE_STANDARD.md. Use .vibe/skills/vibe-engineering/SKILL.md as the canonical router when present. Refresh upstream first when reachable. Verify It Before Everything.\n', force, report);
  await writeManagedFile(root, '.vibe/OPENCODE.md', '# OpenCode adapter\n\nUse the repository filesystem as canonical context. Read `AGENTS.md → ICMR.yaml → CONTEXT.md → .vibe/VIBE_HOUSE_STANDARD.md`, then route material work through `.vibe/skills/vibe-engineering/SKILL.md` when present. Refresh upstream first when reachable. Do not create a parallel agent architecture.\n', force, report);
  await writeManagedFile(root, '.vibe/CODEX.md', '# Codex adapter\n\nCodex should enter through root `AGENTS.md`, then read `ICMR.yaml`, `CONTEXT.md`, and `.vibe/VIBE_HOUSE_STANDARD.md`, then use `.vibe/skills/vibe-engineering/SKILL.md` as the canonical house router when present. Refresh upstream first when reachable.\n', force, report);

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
    const notes = `# Vibe install notes\n\nVibe preserved owner-controlled files instead of overwriting them:\n\n${ownerControlledConflicts.map((item) => `- \`${item}\``).join('\n')}\n\nThe global House standard was installed at \`.vibe/VIBE_HOUSE_STANDARD.md\`. Review preserved project-law files and merge this entry instruction where appropriate:\n\n\`Read AGENTS.md → ICMR.yaml → CONTEXT.md → .vibe/VIBE_HOUSE_STANDARD.md. Use .vibe/skills/vibe-engineering/SKILL.md when present. Refresh upstream first. Verify It Before Everything.\`\n\nDo not replace existing project law blindly. Merge by intent.\n`;
    await writeManagedFile(root, '.vibe/INSTALL-NOTES.md', notes, true, report);
  }

  return report;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const sourceRoot = path.resolve(scriptDir, '..');
  const report = await installVibe(options, sourceRoot);
  console.log('Vibe Engineering House installed.');
  console.log(`Target: ${report.target}`);
  console.log(`Mode: ${report.mode}`);
  console.log(`Written: ${report.written.length}`);
  if (report.skipped.length) console.log(`Preserved existing files: ${report.skipped.join(', ')}`);
  console.log('Next: tell your agent — "Use Vibe Engineering. Refresh upstream and continue from current ICM state."');
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedPath && invokedPath === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`Vibe install failed: ${error.message}`);
    process.exitCode = 1;
  });
}
