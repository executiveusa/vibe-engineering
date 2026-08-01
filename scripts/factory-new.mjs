#!/usr/bin/env node
import { copyFile, mkdir, readFile, readdir, rename, rm, rmdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inspectWorkspace, REQUIRED_STAGES } from './factory-doctor.mjs';

const TEXT_EXTENSIONS = new Set(['.md', '.json', '.yaml', '.yml', '.mjs', '.js', '.txt']);
const SUPPORTED_OPTIONS = new Set(['name', 'mode', 'domain', 'audience', 'target']);

function parseArgs(argv) {
  const options = {
    mode: 'greenfield',
    domain: 'positive technology',
    audience: 'urban youth and seniors',
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) {
      throw new Error(`Unexpected positional argument: ${token}`);
    }
    const key = token.slice(2);
    if (!SUPPORTED_OPTIONS.has(key)) {
      throw new Error(`Unknown option: --${key}`);
    }
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for --${key}`);
    }
    options[key] = value;
    index += 1;
  }

  if (!options.name?.trim()) {
    throw new Error('Provide --name "Project Name".');
  }
  if (!['greenfield', 'brownfield'].includes(options.mode)) {
    throw new Error('--mode must be greenfield or brownfield.');
  }
  return options;
}

function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'vibe-project';
}

async function directoryEntries(target) {
  try {
    const info = await stat(target);
    if (!info.isDirectory()) throw new Error(`Target exists and is not a directory: ${target}`);
    return await readdir(target);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

async function copyDirectory(source, destination) {
  await mkdir(destination, { recursive: true });
  const entries = await readdir(source, { withFileTypes: true });
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, destinationPath);
    } else if (entry.isFile()) {
      await copyFile(sourcePath, destinationPath);
    }
  }
}

function buildTokenPattern(replacements) {
  const alternatives = Object.keys(replacements)
    .map((token) => `\\{\\{${token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\}\\}`)
    .join('|');
  return new RegExp(alternatives, 'g');
}

async function replaceTokens(root, replacements) {
  const tokenPattern = buildTokenPattern(replacements);
  const entries = await readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    const currentPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      await replaceTokens(currentPath, replacements);
      continue;
    }
    if (!entry.isFile() || !TEXT_EXTENSIONS.has(path.extname(entry.name))) continue;

    const content = await readFile(currentPath, 'utf8');
    const replaced = content.replace(tokenPattern, (placeholder) => {
      const token = placeholder.slice(2, -2);
      return String(replacements[token]);
    });
    await writeFile(currentPath, replaced, 'utf8');
  }
}

export async function createWorkspace(options, sourceRoot, hooks = {}) {
  const slug = slugify(options.name);
  const target = path.resolve(options.target ?? path.join(process.cwd(), 'workspaces', slug));
  const existingEntries = await directoryEntries(target);
  const targetExisted = existingEntries !== null;
  if (existingEntries && existingEntries.length > 0) {
    throw new Error(`Refusing to overwrite non-empty target: ${target}`);
  }

  const targetParent = path.dirname(target);
  const temporaryTarget = path.join(
    targetParent,
    `.${path.basename(target)}.vibe-tmp-${process.pid}-${Date.now()}`,
  );
  await mkdir(targetParent, { recursive: true });

  try {
    const templateRoot = path.join(sourceRoot, 'factory', 'icm', 'template');
    await copyDirectory(templateRoot, temporaryTarget);
    await mkdir(path.join(temporaryTarget, 'scripts'), { recursive: true });
    await copyFile(
      path.join(sourceRoot, 'scripts', 'factory-doctor.mjs'),
      path.join(temporaryTarget, 'scripts', 'factory-doctor.mjs'),
    );

    const replacements = {
      PROJECT_NAME: options.name.trim(),
      PROJECT_SLUG: slug,
      PROJECT_MODE: options.mode,
      PROJECT_DOMAIN: options.domain,
      PROJECT_AUDIENCE: options.audience,
      CREATED_AT: new Date().toISOString(),
      PROJECT_NAME_YAML: JSON.stringify(options.name.trim()),
      PROJECT_SLUG_YAML: JSON.stringify(slug),
      PROJECT_MODE_YAML: JSON.stringify(options.mode),
      PROJECT_DOMAIN_YAML: JSON.stringify(options.domain),
      PROJECT_AUDIENCE_YAML: JSON.stringify(options.audience),
    };
    replacements.CREATED_AT_YAML = JSON.stringify(replacements.CREATED_AT);
    await replaceTokens(temporaryTarget, replacements);

    for (const stage of REQUIRED_STAGES) {
      const outputDirectory = path.join(temporaryTarget, 'stages', stage, 'output');
      await mkdir(outputDirectory, { recursive: true });
      await writeFile(path.join(outputDirectory, '.gitkeep'), '', 'utf8');
    }

    await mkdir(path.join(temporaryTarget, '.factory'), { recursive: true });
    await writeFile(path.join(temporaryTarget, '.factory', 'state.json'), `${JSON.stringify({
      schemaVersion: 1,
      factoryVersion: '1.0.0',
      createdAt: replacements.CREATED_AT,
      source: 'executiveusa/vibe-engineering',
      project: {
        name: replacements.PROJECT_NAME,
        slug,
        mode: options.mode,
        domain: options.domain,
        audience: options.audience,
      },
      status: 'created',
      currentStage: '00_intake',
      completedStages: [],
    }, null, 2)}\n`, 'utf8');

    const report = await inspectWorkspace(temporaryTarget);
    if (report.status !== 'PASS') {
      throw new Error(`Generated workspace failed doctor: ${report.errors.join('; ')}`);
    }

    await hooks.beforeCommit?.({ target, temporaryTarget });

    if (targetExisted) {
      // Non-recursive by design: this fails if another process wrote into the
      // destination after the initial emptiness check.
      await rmdir(target);
    }
    await rename(temporaryTarget, target);

    return { target, slug, report: { ...report, root: target } };
  } catch (error) {
    await rm(temporaryTarget, { recursive: true, force: true });
    if (targetExisted && await directoryEntries(target) === null) {
      await mkdir(target, { recursive: true });
    }
    throw error;
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const sourceRoot = path.resolve(scriptDir, '..');
  const result = await createWorkspace(options, sourceRoot);

  console.log('Vibe Engineering workspace created.');
  console.log(`Project: ${options.name}`);
  console.log(`Location: ${result.target}`);
  console.log('Factory Doctor: PASS');
  console.log('Next stage: stages/00_intake/CONTEXT.md');
  console.log('Status: STRUCTURE READY — product not yet built or production-verified.');
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedPath && invokedPath === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`Vibe Factory creation failed: ${error.message}`);
    process.exitCode = 1;
  });
}
