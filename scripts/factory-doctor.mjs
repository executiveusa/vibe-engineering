#!/usr/bin/env node
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const REQUIRED_STAGES = [
  '00_intake',
  '01_vision',
  '02_blueprint',
  '03_build',
  '04_verify',
  '05_council',
  '06_judge',
  '07_ship',
  '08_improve',
];

const REQUIRED_FILES = [
  'README.md',
  'AGENTS.md',
  'CONTEXT.md',
  'PROJECT.yaml',
  'ARCHITECTURE.md',
  'RUNBOOK.md',
  'SECURITY.md',
  'DECISIONS/README.md',
  'docs/specs/README.md',
  'docs/evidence/README.md',
  'docs/handoffs/README.md',
  '_config/mission.md',
  '_config/quality-gates.yaml',
  'shared/PLAIN_LANGUAGE_STANDARD.md',
  'references/README.md',
  '.factory/state.json',
];

const REQUIRED_STAGE_SECTIONS = [
  '## Inputs',
  '## Process',
  '## Outputs',
  '## Human gate',
  '## Plain-language proof',
];

const REQUIRED_PROJECT_KEYS = [
  'id',
  'name',
  'mode',
  'status',
  'owner',
  'business_goal',
  'revenue_model',
  'repository',
  'production_branch',
  'production_url',
  'current_release',
  'current_objective',
  'approved_stack',
  'active_tasks',
  'blocked_tasks',
  'dependencies',
  'acceptance_tests',
  'required_approvals',
  'last_verified_at',
  'rollback_point',
];

const ALLOWED_MODES = new Set(['greenfield', 'brownfield']);
const ALLOWED_STATUSES = new Set([
  'discovery',
  'specified',
  'building',
  'verifying',
  'hold',
  'production',
  'parked',
]);

async function getStats(filePath) {
  try {
    return await stat(filePath);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

function getProjectScalar(content, key) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = content.match(new RegExp(`^  ${escapedKey}:\\s*(.*?)\\s*$`, 'm'));
  if (!match) return null;
  const raw = match[1].trim();
  if (raw.startsWith('"')) {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }
  return raw;
}

function stripFencedCode(content) {
  const lines = content.split(/\r?\n/);
  let fence = null;

  return lines.map((line) => {
    const markerMatch = line.match(/^\s*(`{3,}|~{3,})/);
    if (markerMatch) {
      const marker = markerMatch[1];
      if (!fence) {
        fence = { character: marker[0], length: marker.length };
        return '';
      }
      if (marker[0] === fence.character && marker.length >= fence.length) {
        fence = null;
        return '';
      }
    }
    return fence ? '' : line;
  }).join('\n');
}

export async function inspectWorkspace(rootPath) {
  const root = path.resolve(rootPath);
  const errors = [];
  const warnings = [];

  for (const relativePath of REQUIRED_FILES) {
    const fileStats = await getStats(path.join(root, relativePath));
    if (!fileStats?.isFile()) {
      errors.push(`Missing required file: ${relativePath}`);
    }
  }

  const projectPath = path.join(root, 'PROJECT.yaml');
  const projectStats = await getStats(projectPath);
  if (projectStats?.isFile()) {
    const projectControl = await readFile(projectPath, 'utf8');
    for (const key of REQUIRED_PROJECT_KEYS) {
      if (getProjectScalar(projectControl, key) === null) {
        errors.push(`PROJECT.yaml is missing required project key: ${key}`);
      }
    }

    const mode = getProjectScalar(projectControl, 'mode');
    if (mode !== null && !ALLOWED_MODES.has(mode)) {
      errors.push(`PROJECT.yaml has unsupported project.mode: ${mode}`);
    }

    const status = getProjectScalar(projectControl, 'status');
    if (status !== null && !ALLOWED_STATUSES.has(status)) {
      errors.push(`PROJECT.yaml has unsupported project.status: ${status}`);
    }

    const projectId = getProjectScalar(projectControl, 'id');
    const projectName = getProjectScalar(projectControl, 'name');
    if (!projectId || projectId === 'TO_CONFIRM') {
      errors.push('PROJECT.yaml project.id must be a non-placeholder value');
    }
    if (!projectName || projectName === 'TO_CONFIRM') {
      errors.push('PROJECT.yaml project.name must be a non-placeholder value');
    }
  }

  const stagesRoot = path.join(root, 'stages');
  const stagesStats = await getStats(stagesRoot);
  if (!stagesStats?.isDirectory()) {
    errors.push('Missing required directory: stages');
  } else {
    const stageEntries = await readdir(stagesRoot, { withFileTypes: true });
    const actualStages = new Set(
      stageEntries.filter((entry) => entry.isDirectory()).map((entry) => entry.name),
    );

    for (const stage of REQUIRED_STAGES) {
      if (!actualStages.has(stage)) {
        errors.push(`Missing required stage: stages/${stage}`);
        continue;
      }

      const contextPath = path.join(stagesRoot, stage, 'CONTEXT.md');
      const contextStats = await getStats(contextPath);
      if (!contextStats?.isFile()) {
        errors.push(`Missing stage contract: stages/${stage}/CONTEXT.md`);
        continue;
      }

      const context = stripFencedCode(await readFile(contextPath, 'utf8'));
      for (const section of REQUIRED_STAGE_SECTIONS) {
        const escapedSection = section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const headingPattern = new RegExp(`^${escapedSection}\\s*$`, 'm');
        if (!headingPattern.test(context)) {
          errors.push(`Stage ${stage} is missing section: ${section}`);
        }
      }

      const outputStats = await getStats(path.join(stagesRoot, stage, 'output'));
      if (!outputStats?.isDirectory()) {
        errors.push(`Missing working output directory: stages/${stage}/output`);
      }
    }
  }

  const statePath = path.join(root, '.factory', 'state.json');
  const stateStats = await getStats(statePath);
  if (stateStats?.isFile()) {
    try {
      const state = JSON.parse(await readFile(statePath, 'utf8'));
      if (state.schemaVersion !== 1) {
        errors.push(`Unsupported factory state schema version: ${state.schemaVersion}. Expected 1.`);
      }
      if (!state.project?.name || !state.project?.slug) {
        errors.push('.factory/state.json is missing project.name or project.slug');
      }
      if (!REQUIRED_STAGES.includes(state.currentStage)) {
        errors.push(`.factory/state.json has unsupported currentStage: ${state.currentStage}`);
      }
    } catch (error) {
      errors.push(`Invalid JSON in .factory/state.json: ${error.message}`);
    }
  }

  return {
    root,
    status: errors.length === 0 ? 'PASS' : 'BLOCKED',
    errors,
    warnings,
    checkedStages: REQUIRED_STAGES.length,
  };
}

function printReport(report) {
  console.log(`Vibe Factory Doctor: ${report.status}`);
  console.log(`Workspace: ${report.root}`);
  console.log(`Stages checked: ${report.checkedStages}`);

  for (const warning of report.warnings) {
    console.log(`WARNING: ${warning}`);
  }
  for (const error of report.errors) {
    console.error(`ERROR: ${error}`);
  }

  if (report.status === 'PASS') {
    console.log('Structure verified. This does not prove application behavior, security, deployment, or customer value.');
  }
}

async function main() {
  const target = process.argv[2] ?? process.cwd();
  const report = await inspectWorkspace(target);
  printReport(report);
  if (report.status !== 'PASS') process.exitCode = 1;
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedPath && invokedPath === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`Vibe Factory Doctor failed: ${error.message}`);
    process.exitCode = 1;
  });
}
