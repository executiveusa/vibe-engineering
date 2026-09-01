import { getIcmBackendMap } from '../../../icm/backend/index.mjs';

export default async function handler(req, res) {
  res.setHeader('cache-control', 'public, max-age=60');
  if (req.method !== 'GET') {
    res.setHeader('allow', 'GET');
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }
  return res.status(200).json(getIcmBackendMap());
}
