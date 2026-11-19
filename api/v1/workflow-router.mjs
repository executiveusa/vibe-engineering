import { listWorkflows, listSkillSources, routeWorkflow } from '../../src/workflows/skill-router.mjs';

const FIELDS = new Set(['request', 'icmStage', 'workflowId', 'builderModel', 'reviewerModel', 'candidate', 'base', 'changedFiles']);

function valid(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return false;
  if (Object.keys(body).some((key) => !FIELDS.has(key))) return false;
  for (const key of FIELDS) {
    if (key === 'changedFiles') continue;
    if (body[key] != null && (typeof body[key] !== 'string' || body[key].length > 4000)) return false;
  }
  return body.changedFiles == null || (Array.isArray(body.changedFiles) &&
    body.changedFiles.length <= 200 &&
    body.changedFiles.every((item) => typeof item === 'string' && item.length <= 260));
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    res.setHeader('cache-control', 'public, max-age=60');
    return res.status(200).json({ workflows: listWorkflows(), sourceCount: listSkillSources().length,
      routing: 'POST a task and ICM stage to receive a lazy-load packet. No code execution or subagents are triggered by this endpoint.' });
  }
  res.setHeader('cache-control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('allow', 'GET, POST');
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }
  let body;
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; }
  catch { return res.status(400).json({ error: 'INVALID_JSON' }); }
  if (!valid(body)) return res.status(400).json({ error: 'INVALID_WORKFLOW_REQUEST' });
  try { return res.status(200).json(routeWorkflow(body)); }
  catch (error) { return res.status(400).json({ error: 'INVALID_WORKFLOW_REQUEST', message: error.message }); }
}
