import { runSkill } from '../../src/skills/index.mjs';

export default async function handler(req, res) {
  res.setHeader('cache-control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('allow', 'POST');
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {});
    const result = runSkill(body.id, body.input ?? {});
    if (!result) return res.status(404).json({ error: 'SKILL_NOT_FOUND', id: body.id ?? null });
    return res.status(200).json(result);
  } catch {
    return res.status(400).json({ error: 'INVALID_JSON' });
  }
}
