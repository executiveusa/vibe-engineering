#!/usr/bin/env node
import { copyFile, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inspectWorkspace, REQUIRED_STAGES } from './factory-doctor.mjs';

const TEXT_EXTENSIONS = new Set(['.md', '.json', '.yaml', '.yml', '.mjs', '.js', '.txt']);

function parseArgs(argv) {
  const options = {
    mode: 'greenfield',
    domain: 'positive technology',
    audience: 'urban youth and seniors',
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
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

async function replaceTokens(root, replacements) {
  const entries = await readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    const currentPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      await replaceTokens(currentPath, replacements);
      continue;
    }
    if (!entry.isFile() || !TEXT_EXTENSIONS.has(path.extname(entry.name))) continue;

    let content = await readFile(currentPath, 'utf8');
    for (const [token, value] of Object.entries(replacements)) {
      content = content.replaceAll(`{{${token}}}`, value);
    }
    await writeFile(currentPath, content, 'utf8');
  }
}

export async function createWorkspace(options, sourceRoot) {
  const slug = slugify(options.name);
  const target = path.resolve(options.target ?? path.join(process.cwd(), 'workspaces', slug));
  const existingEntries = await directoryEntries(target);
  if (existingEntries && existingEntries.length > 0) {
    throw new Error(`Refusing to overwrite non-empty target: ${target}`);
  }

  const templateRoot = path.join(sourceRoot, 'factory', 'icm', 'template');
  await copyDirectory(templateRoot, target);
  await mkdir(path.join(target, 'scripts'), { recursive: true });
  await copyFile(
    path.join(sourceRoot, 'scripts', 'factory-doctor.mjs'),
    path.join(target, 'scripts', 'factory-doctor.mjs'),
  );

  const replacements = {
    PROJECT_NAME: options.name.trim(),
    PROJECT_SLUG: slug,
    PROJECT_MODE: options.mode,
    PROJECT_DOMAIN: options.domain,
    PROJECT_AUDIENCE: options.audience,
    CREATED_AT: new Date().toISOString(),
  };
  await replaceTokens(target, replacements);

  for (const stage of REQUIRED_STAGES) {
    const outputDirectory = path.join(target, 'stages', stage, 'output');
    await mkdir(outputDirectory, { recursive: true });
    await writeFile(path.join(outputDirectory, '.gitkeep'), '', 'utf8');
  }

  await mkdir(path.join(target, '.factory'), { recursive: true });
  await writeFile(path.join(target, '.factory', 'state.json'), `${JSON.stringify({
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

  const report = await inspectWorkspace(target);
  if (report.status !== 'PASS') {
    throw new Error(`Generated workspace failed doctor: ${report.errors.join('; ')}`);
  }

  return { target, slug, report };
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
