export const SCORE_DIMENSIONS = [
  { key: 'clarity', label: 'Clarity', question: 'Can the owner explain the product and its promise?' },
  { key: 'reliability', label: 'Reliability', question: 'Does it behave correctly when conditions change?' },
  { key: 'security', label: 'Security', question: 'Are access, data, secrets, and failure modes controlled?' },
  { key: 'maintainability', label: 'Maintainability', question: 'Can another builder safely continue the work?' },
  { key: 'taste', label: 'Taste', question: 'Does every visible detail feel intentional?' },
  { key: 'ownership', label: 'Ownership', question: 'Can the customer leave with code, data, and access?' },
];

export const RELEASE_FLOOR = 8.5;

export function normalizeScores(input = {}) {
  return Object.fromEntries(
    SCORE_DIMENSIONS.map(({ key }) => {
      const value = Number(input[key]);
      const safeValue = Number.isFinite(value) ? Math.min(10, Math.max(0, value)) : 0;
      return [key, safeValue];
    }),
  );
}

export function calculateVibeScore(input = {}) {
  const scores = normalizeScores(input);
  const values = Object.values(scores);
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const weakest = SCORE_DIMENSIONS.reduce((lowest, dimension) => {
    if (!lowest || scores[dimension.key] < scores[lowest.key]) return dimension;
    return lowest;
  }, null);

  const hardStops = [];
  if (scores.security < 7) hardStops.push('security');
  if (scores.ownership < 7) hardStops.push('ownership');
  if (scores.reliability < 7) hardStops.push('reliability');

  const rounded = Math.round(average * 10) / 10;
  const status = rounded >= RELEASE_FLOOR && hardStops.length === 0 ? 'SHIP' : 'HOLD';

  return {
    score: rounded,
    status,
    weakest: weakest?.key ?? null,
    hardStops,
    scores,
  };
}
