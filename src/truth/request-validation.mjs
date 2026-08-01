const ALLOWED_ROOT = new Set(['agent', 'project', 'task', 'scope']);
const CONSEQUENCE = new Set(['low', 'medium', 'high']);
const MODES = new Set(['greenfield', 'brownfield', 'discovery', 'recovery', 'public-release']);
const ACTIONS = new Set(['inspect', 'software-change', 'public-release', 'destructive-change', 'content-change', 'security-review']);
const REPOSITORY = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;

function plainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function validateContextRequest(input) {
  const errors = [];
  if (!plainObject(input)) return { valid: false, errors: ['body must be a JSON object'] };

  for (const key of Object.keys(input)) {
    if (!ALLOWED_ROOT.has(key)) errors.push(`unknown field '${key}'`);
  }

  if (input.project !== undefined) {
    if (!plainObject(input.project)) errors.push('project must be an object');
    else {
      const allowed = new Set(['repository', 'mode']);
      for (const key of Object.keys(input.project)) if (!allowed.has(key)) errors.push(`unknown project field '${key}'`);
      if (input.project.repository !== undefined && !REPOSITORY.test(input.project.repository)) errors.push('project.repository must use owner/repository format');
      if (input.project.mode !== undefined && !MODES.has(input.project.mode)) errors.push('project.mode is unsupported');
    }
  }

  if (input.task !== undefined) {
    if (!plainObject(input.task)) errors.push('task must be an object');
    else {
      const allowed = new Set(['type', 'requestedAction', 'consequenceLevel']);
      for (const key of Object.keys(input.task)) if (!allowed.has(key)) errors.push(`unknown task field '${key}'`);
      if (input.task.consequenceLevel !== undefined && !CONSEQUENCE.has(input.task.consequenceLevel)) errors.push('task.consequenceLevel must be low, medium, or high');
      if (input.task.requestedAction !== undefined && !ACTIONS.has(input.task.requestedAction)) errors.push('task.requestedAction is unsupported');
      if (input.task.type !== undefined && (typeof input.task.type !== 'string' || input.task.type.length > 100)) errors.push('task.type must be a string up to 100 characters');
    }
  }

  if (input.scope !== undefined) {
    if (!plainObject(input.scope)) errors.push('scope must be an object');
    else {
      const allowed = new Set(['allowed', 'prohibited']);
      for (const key of Object.keys(input.scope)) if (!allowed.has(key)) errors.push(`unknown scope field '${key}'`);
      for (const key of ['allowed', 'prohibited']) {
        if (input.scope[key] !== undefined && (!Array.isArray(input.scope[key]) || input.scope[key].some((item) => typeof item !== 'string'))) errors.push(`scope.${key} must be an array of strings`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
