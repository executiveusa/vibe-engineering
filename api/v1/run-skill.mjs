import { runSkill } from '../../icm/backend/index.mjs';

function validRunSkillRequest(body) {
  if (!body || Array.isArray(body) || typeof body !== 'object') return false;
  const keys = Object.keys(body);
  if (keys.some((key) => key !== 'id' && key !== 'input')) return false;
  if (typeof body.id !== 'string' || !body.id.trim()) return false;
  if (body.input !== undefined && (body.input === null || Array.isArray(body.input) || typeof body.input !== 'object')) return false;
  return true;
}

export default async function handler(req, res) {
  res.setHeader('cache-control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('allow', 'POST');
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {});
    if (!validRunSkillRequest(body)) return res.status(400).json({ error: 'INVALID_RUN_SKILL_REQUEST' });
    const result = runSkill(body.id, body.input ?? {});
    if (!result) return res.status(404).json({ error: 'SKILL_NOT_FOUND', id: body.id });
    return res.status(200).json(result);
  } catch {
    return res.status(400).json({ error: 'INVALID_JSON' });
  }
}
