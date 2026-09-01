import { getSkill } from '../../../src/skills/catalog.mjs';

export default async function handler(req, res) {
  res.setHeader('cache-control', 'public, max-age=60');
  if (req.method !== 'GET') {
    res.setHeader('allow', 'GET');
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }
  const item = getSkill(req.query?.id);
  if (!item) return res.status(404).json({ error: 'SKILL_NOT_FOUND', id: req.query?.id ?? null });
  return res.status(200).json(item);
}
