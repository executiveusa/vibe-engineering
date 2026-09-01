import { runIcmWalk } from '../../../icm/backend/index.mjs';

export default async function handler(req, res) {
  res.setHeader('cache-control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('allow', 'GET');
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }
  try {
    const result = await runIcmWalk();
    return res.status(result.ok ? 200 : 503).json(result);
  } catch (error) {
    return res.status(500).json({ error: 'ICM_WALK_FAILED', message: error?.message ?? 'Unknown walk failure' });
  }
}
