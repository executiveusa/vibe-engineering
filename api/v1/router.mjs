import { getIcmBackendMap, getSkill, listSkills, runIcmWalk } from '../../icm/backend/index.mjs';

function methodNotAllowed(res) {
  res.setHeader('allow', 'GET');
  return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res);

  const route = req.query?.route;

  if (route === 'skills') {
    res.setHeader('cache-control', 'public, max-age=60');
    return res.status(200).json({ skills: listSkills() });
  }

  if (route === 'skill') {
    res.setHeader('cache-control', 'public, max-age=60');
    const item = getSkill(req.query?.id);
    if (!item) return res.status(404).json({ error: 'SKILL_NOT_FOUND', id: req.query?.id ?? null });
    return res.status(200).json(item);
  }

  if (route === 'icm-map') {
    res.setHeader('cache-control', 'public, max-age=60');
    return res.status(200).json(getIcmBackendMap());
  }

  if (route === 'icm-walk') {
    res.setHeader('cache-control', 'no-store');
    try {
      const result = await runIcmWalk();
      return res.status(result.ok ? 200 : 503).json(result);
    } catch (error) {
      return res.status(500).json({ error: 'ICM_WALK_FAILED', message: error?.message ?? 'Unknown walk failure' });
    }
  }

  res.setHeader('cache-control', 'no-store');
  return res.status(404).json({ error: 'NOT_FOUND' });
}
