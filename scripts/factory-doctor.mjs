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
  'references/ENGINEERING-WORKFLOW.md',
  '.factory/state.json',
];

const REQUIRED_NONEMPTY_FILES = new Set(
  REQUIRED_FILES.filter((relativePath) => relativePath !== '.factory/state.json'),
);

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

const PROJECT_ARRAY_KEYS = new Set([
  'approved_stack',
  'active_tasks',
  'blocked_tasks',
  'dependencies',
  'acceptance_tests',
  'required_approvals',
]);

const PROJECT_STRING_KEYS = new Set(
  REQUIRED_PROJECT_KEYS.filter((key) => !PROJECT_ARRAY_KEYS.has(key)),
);

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

const WORKFLOW_INVARIANTS = [
  {
    file: 'references/ENGINEERING-WORKFLOW.md',
    checks: [
      ['canonical Agent Skills source', /executiveusa\/pauli-agent-skills-2026/],
      ['engineering lifecycle', /DEFINE\s*→\s*PLAN\s*→\s*BUILD\s*→\s*VERIFY\s*→\s*REVIEW\s*→\s*SHIP/],
      ['classification gate', /SELL[\s\S]{0,120}USE[\s\S]{0,120}MERGE[\s\S]{0,120}PARK[\s\S]{0,120}ARCHIVE/],
      ['greenfield/brownfield mode gate', /greenfield[\s\S]{0,120}brownfield|brownfield[\s\S]{0,120}greenfield/],
      ['specification gate', /approved specification|specification before implementation|confirm the approved specification/i],
      ['one-slice gate', /one independently verifiable slice|one verifiable slice/i],
      ['rollback release boundary', /rollback/i],
      ['independent release authority', /Council\/Judge|Judge or authorized human|builder cannot approve/i],
    ],
  },
  {
    file: 'AGENTS.md',
    checks: [
      ['canonical Agent Skills source', /executiveusa\/pauli-agent-skills-2026/],
      ['mandatory engineering lifecycle', /DEFINE\s*→\s*PLAN\s*→\s*BUILD\s*→\s*VERIFY\s*→\s*REVIEW\s*→\s*SHIP/],
      ['specification before implementation', /approved specification|Specify before building/i],
      ['release authority separation', /builder cannot approve|builder cannot approve its own work/i],
    ],
  },
  {
    file: 'stages/03_build/CONTEXT.md',
    checks: [
      ['workflow reference', /references\/ENGINEERING-WORKFLOW\.md/],
      ['skill routing before implementation', /route the slice through the applicable skills|applicable skills/i],
      ['brownfield baseline gate', /brownfield[\s\S]{0,180}baseline/i],
      ['greenfield pre-build gate', /greenfield[\s\S]{0,220}(approved|specification|tickets)/i],
    ],
  },
  {
    file: 'stages/04_verify/CONTEXT.md',
    checks: [
      ['workflow reference', /references\/ENGINEERING-WORKFLOW\.md/],
      ['verification skill routing', /verification\/review skills|applicable verification/i],
      ['live-production proof boundary', /not live-production proof|not.*production proof/i],
      ['independent review boundary', /builder cannot approve its own implementation|builder cannot approve/i],
    ],
  },
  {
    file: 'RUNBOOK.md',
    checks: [
      ['rollback section', /^## .*rollback/im],
      ['tested rollback requirement', /rollback[\s\S]{0,180}tested|tested[\s\S]{0,180}rollback/i],
    ],
  },
];

async function getStats(filePath) {
  try {
    return await stat(filePath);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

function stripYamlComment(raw) {
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let escaped = false;

  for (let index = 0; index < raw.length; index += 1) {
    const character = raw[index];

    if (inDoubleQuote) {
      if (escaped) {
        escaped = false;
      } else if (character === '\\') {
        escaped = true;
      } else if (character === '"') {
        inDoubleQuote = false;
      }
      continue;
    }

    if (inSingleQuote) {
      if (character === "'" && raw[index + 1] === "'") {
        index += 1;
      } else if (character === "'") {
        inSingleQuote = false;
      }
      continue;
    }

    if (character === '"') {
      inDoubleQuote = true;
    } else if (character === "'") {
      inSingleQuote = true;
    } else if (character === '#' && (index === 0 || /\s/.test(raw[index - 1]))) {
      return raw.slice(0, index);
    }
  }

  return raw;
}

function parseYamlScalar(raw) {
  const value = stripYamlComment(raw).trim();
  if (value === '' || /^(?:null|~)$/i.test(value)) return null;
  if (value === '[]') return [];
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number(value);
  if (value.startsWith('"')) return JSON.parse(value);
  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replace(/''/g, "'");
  }
  return value;
}

function parseProjectControl(content) {
  const root = {};
  let currentTopLevel = null;
  let currentNestedKey = null;

  for (const [index, rawLine] of content.split(/\r?\n/).entries()) {
    const line = stripYamlComment(rawLine);
    if (!line.trim()) continue;

    const topLevel = line.match(/^([A-Za-z0-9_]+):\s*(.*?)\s*$/);
    if (topLevel) {
      const [, key, rawValue] = topLevel;
      if (rawValue === '') {
        root[key] = {};
        currentTopLevel = key;
        currentNestedKey = null;
      } else {
        root[key] = parseYamlScalar(rawValue);
        currentTopLevel = null;
        currentNestedKey = null;
      }
      continue;
    }

    const nested = line.match(/^  ([A-Za-z0-9_]+):\s*(.*?)\s*$/);
    if (nested && currentTopLevel) {
      const [, key, rawValue] = nested;
      root[currentTopLevel][key] = rawValue === '' ? [] : parseYamlScalar(rawValue);
      currentNestedKey = key;
      continue;
    }

    const listItem = line.match(/^    -\s+(.*?)\s*$/);
    if (listItem && currentTopLevel && currentNestedKey) {
      const currentValue = root[currentTopLevel][currentNestedKey];
      if (!Array.isArray(currentValue)) {
        throw new Error(`Line ${index + 1} adds a list item to a non-list key`);
      }
      currentValue.push(parseYamlScalar(listItem[1]));
      continue;
    }

    throw new Error(`Unsupported PROJECT.yaml structure at line ${index + 1}`);
  }

  return root;
}

function stripFencedCode(content) {
  const lines = content.split(/\r?\n/);
  let fence = null;

  return lines.map((line) => {
    if (!fence) {
      const opening = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
      if (opening) {
        const marker = opening[1];
        fence = { character: marker[0], length: marker.length };
        return '';
      }
      return line;
    }

    const closingPattern = new RegExp(`^ {0,3}${fence.character}{${fence.length},}\\s*$`);
    if (closingPattern.test(line)) fence = null;
    return '';
  }).join('\n');
}

async function validateWorkflowInvariants(root, errors) {
  for (const invariant of WORKFLOW_INVARIANTS) {
    const absolutePath = path.join(root, invariant.file);
    const fileStats = await getStats(absolutePath);
    if (!fileStats?.isFile()) continue;

    const content = stripFencedCode(await readFile(absolutePath, 'utf8'));
    for (const [label, pattern] of invariant.checks) {
      if (!pattern.test(content)) {
        errors.push(`Mandatory workflow invariant missing in ${invariant.file}: ${label}`);
      }
    }
  }
}

export async function inspectWorkspace(rootPath) {
  const root = path.resolve(rootPath);
  const errors = [];
  const warnings = [];

  for (const relativePath of REQUIRED_FILES) {
    const absolutePath = path.join(root, relativePath);
    const fileStats = await getStats(absolutePath);
    if (!fileStats?.isFile()) {
      errors.push(`Missing required file: ${relativePath}`);
      continue;
    }
    if (REQUIRED_NONEMPTY_FILES.has(relativePath)) {
      const content = await readFile(absolutePath, 'utf8');
      if (!content.trim()) {
        errors.push(`Required control file is empty: ${relativePath}`);
      }
    }
  }

  await validateWorkflowInvariants(root, errors);

  const projectPath = path.join(root, 'PROJECT.yaml');
  const projectStats = await getStats(projectPath);
  if (projectStats?.isFile()) {
    try {
      const projectDocument = parseProjectControl(await readFile(projectPath, 'utf8'));
      if (!projectDocument.project || typeof projectDocument.project !== 'object' || Array.isArray(projectDocument.project)) {
        errors.push('PROJECT.yaml must contain a top-level project mapping');
      } else {
        const project = projectDocument.project;
        for (const key of REQUIRED_PROJECT_KEYS) {
          if (!Object.prototype.hasOwnProperty.call(project, key)) {
            errors.push(`PROJECT.yaml is missing required project key: ${key}`);
          }
        }

        for (const key of PROJECT_STRING_KEYS) {
          if (Object.prototype.hasOwnProperty.call(project, key) && typeof project[key] !== 'string') {
            errors.push(`PROJECT.yaml project.${key} must be a string`);
          }
        }
        for (const key of PROJECT_ARRAY_KEYS) {
          if (Object.prototype.hasOwnProperty.call(project, key) && !Array.isArray(project[key])) {
            errors.push(`PROJECT.yaml project.${key} must be a list`);
          }
        }

        if (typeof project.mode === 'string' && !ALLOWED_MODES.has(project.mode)) {
          errors.push(`PROJECT.yaml has unsupported project.mode: ${project.mode}`);
        }

        if (typeof project.status === 'string' && !ALLOWED_STATUSES.has(project.status)) {
          errors.push(`PROJECT.yaml has unsupported project.status: ${project.status}`);
        }

        if (typeof project.id !== 'string' || !project.id || project.id === 'TO_CONFIRM') {
          errors.push('PROJECT.yaml project.id must be a non-placeholder value');
        }
        if (typeof project.name !== 'string' || !project.name || project.name === 'TO_CONFIRM') {
          errors.push('PROJECT.yaml project.name must be a non-placeholder value');
        }
      }
    } catch (error) {
      errors.push(`Invalid PROJECT.yaml: ${error.message}`);
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

  for (const warning of report.warnings) console.log(`WARNING: ${warning}`);
  for (const error of report.errors) console.error(`ERROR: ${error}`);

  if (report.status === 'PASS') {
    console.log('Structure and mandatory engineering workflow verified. This does not prove application behavior, security, deployment, or customer value.');
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
