const ICMR_VERSION = '1.0';
const FORMS = ['pipeline', 'umbrella', 'record_library', 'knowledge_bundle', 'context_map', 'composite'];

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function textOf(input = {}) {
  return [input.title, input.description, input.target, input.commercialValue, ...(input.roles ?? []), ...(input.constraints ?? [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function hasAny(text, words) {
  return words.some((word) => text.includes(word));
}

function inferMode(input, text) {
  if (input.mode === 'greenfield' || input.mode === 'brownfield') return input.mode;
  return input.repository || hasAny(text, ['existing', 'current system', 'legacy', 'repo', 'repository', 'already built']) ? 'brownfield' : 'greenfield';
}

function inferForm(text) {
  const scores = {
    pipeline: hasAny(text, ['workflow', 'pipeline', 'process', 'stage', 'handoff', 'sequence']) ? 3 : 0,
    umbrella: hasAny(text, ['organization', 'program', 'portfolio', 'department', 'business', 'nonprofit', 'studio']) ? 3 : 0,
    record_library: hasAny(text, ['records', 'cases', 'transactions', 'clients', 'patients', 'inventory', 'ledger']) ? 3 : 0,
    knowledge_bundle: hasAny(text, ['research', 'knowledge', 'documentation', 'curriculum', 'library', 'reference']) ? 3 : 0,
    context_map: hasAny(text, ['agent', 'role', 'roles', 'orchestrator', 'context', 'authority', 'routing']) ? 3 : 0,
  };
  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const positive = ranked.filter(([, score]) => score > 0);
  if (positive.length > 1 && positive[0][1] === positive[1][1]) return { form: 'composite', scores };
  if (!positive.length) return { form: 'context_map', scores };
  return { form: positive[0][0], scores };
}

function inferRoleStructure(input, text) {
  const count = Array.isArray(input.roles) ? input.roles.filter(Boolean).length : 0;
  if (hasAny(text, ['orchestrator', 'dispatcher', 'router', 'manager agent'])) return 'orchestrator_hub';
  if (hasAny(text, ['matrix', 'cross-functional', 'multiple teams'])) return 'role_matrix';
  if (count > 1 || hasAny(text, ['handoff', 'then', 'reviewer', 'builder', 'judge'])) return 'role_chain';
  return 'single_role';
}

function inferExecution(text) {
  if (hasAny(text, ['autonomous', '24/7', 'cron', 'background agent'])) return 'bounded_autonomous';
  if (hasAny(text, ['human approval', 'human gate', 'approve', 'sign off'])) return 'agent_led_human_gated';
  if (hasAny(text, ['agent', 'ai', 'automation'])) return 'agent_assisted';
  return 'human_led';
}

function inferStateModel(text) {
  const file = hasAny(text, ['repo', 'repository', 'files', 'documents', 'codebase']);
  const record = hasAny(text, ['database', 'records', 'transactions', 'clients', 'inventory', 'ledger']);
  const graph = hasAny(text, ['graph', 'relationships', 'dependencies', 'network']);
  const count = [file, record, graph].filter(Boolean).length;
  if (count > 1) return 'mixed';
  if (graph) return 'graph';
  if (record) return 'records';
  return 'files';
}

export function detectWork(input = {}) {
  const description = clean(input.description);
  if (!description) return { valid: false, errors: ['description is required'] };
  const text = textOf(input);
  const mode = inferMode(input, text);
  const { form, scores } = inferForm(text);
  const roleStructure = inferRoleStructure(input, text);
  const execution = inferExecution(text);
  const stateModel = inferStateModel(text);
  const matchedSignals = Object.entries(scores).filter(([, score]) => score > 0).map(([name]) => name);
  const confidence = Math.min(0.95, 0.55 + matchedSignals.length * 0.08 + (input.mode ? 0.08 : 0) + (input.roles?.length ? 0.06 : 0));

  return {
    valid: true,
    icmrVersion: ICMR_VERSION,
    mode,
    form,
    roleStructure,
    execution,
    stateModel,
    confidence: Number(confidence.toFixed(2)),
    signals: matchedSignals,
    assumptions: [
      ...(input.mode ? [] : [`mode inferred as ${mode}`]),
      ...(matchedSignals.length ? [] : ['no strong topology keywords; defaulted to context_map']),
    ],
    next: 'compile_icmr',
  };
}

function slugify(value) {
  return (clean(value) || 'untitled-work')
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'untitled-work';
}

function quoteYaml(value) {
  return JSON.stringify(value ?? '');
}

function yamlList(values = [], indent = 2) {
  return values.length ? values.map((value) => `${' '.repeat(indent)}- ${quoteYaml(value)}`).join('\n') : `${' '.repeat(indent)}[]`;
}

export function compileIcmr(input = {}) {
  const detection = input.detection?.valid ? input.detection : detectWork(input);
  if (!detection.valid) return detection;
  const title = clean(input.title) || 'Untitled Work';
  const roles = (input.roles ?? []).filter(Boolean);
  const constraints = (input.constraints ?? []).filter(Boolean);
  const approvals = (input.approvals ?? ['production release', 'legal/financial commitments', 'destructive actions']).filter(Boolean);
  const icmr = {
    icmr_version: ICMR_VERSION,
    identity: {
      id: slugify(title),
      title,
      description: clean(input.description),
      target: clean(input.target) || 'TO_CONFIRM',
      commercial_value: clean(input.commercialValue) || 'TO_CONFIRM',
    },
    detection: {
      mode: detection.mode,
      form: detection.form,
      role_structure: detection.roleStructure,
      execution: detection.execution,
      state_model: detection.stateModel,
      confidence: detection.confidence,
      signals: detection.signals,
      assumptions: detection.assumptions,
    },
    routing: { entry: 'AGENTS.md', workspace_contract: 'CONTEXT.md', next: '00_intake' },
    roles,
    contracts: {
      constraints,
      approvals,
      builder_self_approval: false,
      inspect_before_change: true,
      specification_before_build: true,
    },
    proof: {
      required: ['observable acceptance evidence', 'independent review proportional to consequence'],
      production_claim_requires_live_target_evidence: true,
    },
    sovereignty: {
      owner_controls: ['code', 'data', 'domain', 'hosting', 'credentials', 'documentation', 'rollback'],
      secrets_in_artifacts: false,
    },
    rollback: { required: true, point: clean(input.rollbackPoint) || 'TO_CONFIRM' },
    outputs: ['ICMR.yaml', 'approved specification', 'slice evidence', 'release evidence'],
  };

  const yaml = `icmr_version: "${ICMR_VERSION}"\nidentity:\n  id: ${quoteYaml(icmr.identity.id)}\n  title: ${quoteYaml(title)}\n  description: ${quoteYaml(icmr.identity.description)}\n  target: ${quoteYaml(icmr.identity.target)}\n  commercial_value: ${quoteYaml(icmr.identity.commercial_value)}\ndetection:\n  mode: ${quoteYaml(detection.mode)}\n  form: ${quoteYaml(detection.form)}\n  role_structure: ${quoteYaml(detection.roleStructure)}\n  execution: ${quoteYaml(detection.execution)}\n  state_model: ${quoteYaml(detection.stateModel)}\n  confidence: ${detection.confidence}\n  signals:\n${yamlList(detection.signals, 4)}\n  assumptions:\n${yamlList(detection.assumptions, 4)}\nrouting:\n  entry: "AGENTS.md"\n  workspace_contract: "CONTEXT.md"\n  next: "00_intake"\nroles:\n${yamlList(roles, 2)}\ncontracts:\n  constraints:\n${yamlList(constraints, 4)}\n  approvals:\n${yamlList(approvals, 4)}\n  builder_self_approval: false\n  inspect_before_change: true\n  specification_before_build: true\nproof:\n  required:\n${yamlList(icmr.proof.required, 4)}\n  production_claim_requires_live_target_evidence: true\nsovereignty:\n  owner_controls:\n${yamlList(icmr.sovereignty.owner_controls, 4)}\n  secrets_in_artifacts: false\nrollback:\n  required: true\n  point: ${quoteYaml(icmr.rollback.point)}\noutputs:\n${yamlList(icmr.outputs, 2)}\n`;

  return { valid: true, detection, icmr, yaml };
}

function validateObject(icmr) {
  const errors = [];
  if (icmr?.icmr_version !== ICMR_VERSION) errors.push(`icmr_version must be ${ICMR_VERSION}`);
  for (const key of ['identity', 'detection', 'routing', 'contracts', 'proof', 'sovereignty', 'rollback']) {
    if (!icmr?.[key] || typeof icmr[key] !== 'object') errors.push(`missing required object: ${key}`);
  }
  if (!Array.isArray(icmr?.roles)) errors.push('roles must be an array');
  if (!Array.isArray(icmr?.outputs)) errors.push('outputs must be an array');
  if (icmr?.routing?.entry !== 'AGENTS.md') errors.push('routing.entry must be AGENTS.md');
  if (icmr?.routing?.workspace_contract !== 'CONTEXT.md') errors.push('routing.workspace_contract must be CONTEXT.md');
  if (!['greenfield', 'brownfield'].includes(icmr?.detection?.mode)) errors.push('detection.mode must be greenfield or brownfield');
  if (!FORMS.includes(icmr?.detection?.form)) errors.push(`detection.form must be one of: ${FORMS.join(', ')}`);
  if (icmr?.contracts?.builder_self_approval !== false) errors.push('builder_self_approval must be false');
  if (icmr?.rollback?.required !== true) errors.push('rollback.required must be true');
  return errors;
}

function validateYaml(yaml) {
  const errors = [];
  const required = ['identity', 'detection', 'routing', 'roles', 'contracts', 'proof', 'sovereignty', 'rollback', 'outputs'];
  if (!/^icmr_version:\s*["']?1\.0["']?\s*$/m.test(yaml)) errors.push('icmr_version must be 1.0');
  for (const key of required) if (!new RegExp(`^${key}:`, 'm').test(yaml)) errors.push(`missing required section: ${key}`);
  if (!/^\s+entry:\s*["']?AGENTS\.md["']?\s*$/m.test(yaml)) errors.push('routing.entry must be AGENTS.md');
  if (!/^\s+workspace_contract:\s*["']?CONTEXT\.md["']?\s*$/m.test(yaml)) errors.push('routing.workspace_contract must be CONTEXT.md');
  return errors;
}

export function validateIcmr(input = {}) {
  const candidate = input.icmr ?? input;
  const errors = typeof candidate === 'string' ? validateYaml(candidate) : validateObject(candidate);
  return { valid: errors.length === 0, icmrVersion: ICMR_VERSION, errors };
}

export { ICMR_VERSION };
