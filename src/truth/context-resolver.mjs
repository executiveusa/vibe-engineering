const CONSEQUENCE_REVIEWERS = {
  low: ['scope-guardian', 'evidence-guardian'],
  medium: ['scope-guardian', 'architecture-guardian', 'failure-guardian', 'evidence-guardian'],
  high: ['customer-guardian', 'scope-guardian', 'architecture-guardian', 'failure-guardian', 'security-guardian', 'sovereignty-guardian', 'evidence-guardian', 'commercial-guardian', 'taste-guardian'],
};

export function resolveContext(bundle, request = {}) {
  const consequenceLevel = request.task?.consequenceLevel ?? 'medium';
  if (!CONSEQUENCE_REVIEWERS[consequenceLevel]) {
    throw new Error(`Unsupported consequence level '${consequenceLevel}'`);
  }

  const approved = bundle.artifacts.filter((artifact) => artifact.status === 'approved');
  const constitution = approved.find((artifact) => artifact.kind === 'constitution');
  const workflow = approved.find((artifact) => artifact.kind === 'workflow');
  const releasePolicy = approved.find((artifact) => artifact.id === 'policy.vibe-score-release');

  if (!constitution || !workflow || !releasePolicy) {
    throw new Error('Required constitutional, workflow, or release-policy truth is missing');
  }

  const humanApprovalRequired = consequenceLevel === 'high'
    || request.task?.requestedAction === 'public-release'
    || request.task?.requestedAction === 'destructive-change';

  return {
    contractVersion: '1.0.0',
    truth: {
      bundleHash: bundle.bundleHash,
      sourceCommit: bundle.sourceCommit,
      artifacts: [constitution, workflow, releasePolicy].map(({ id, version, contentHash, sourcePath, precedence }) => ({
        id, version, contentHash, sourcePath, precedence,
      })),
    },
    project: {
      repository: request.project?.repository ?? null,
      mode: request.project?.mode ?? 'brownfield',
    },
    task: {
      type: request.task?.type ?? 'unspecified',
      requestedAction: request.task?.requestedAction ?? null,
      consequenceLevel,
    },
    laws: constitution.laws,
    workflow: {
      id: workflow.id,
      version: workflow.version,
      stages: workflow.stages,
      meaningfulRepairAttempts: workflow.limits.meaningfulRepairAttempts,
    },
    scope: {
      allowed: request.scope?.allowed ?? [],
      prohibited: request.scope?.prohibited ?? ['secrets', 'unrelated-production-data', 'owner-credentials'],
    },
    requiredReviewers: CONSEQUENCE_REVIEWERS[consequenceLevel],
    proofContract: workflow.proof,
    releasePolicy: releasePolicy.rules,
    humanApproval: {
      required: humanApprovalRequired,
      reasons: humanApprovalRequired ? ['high-consequence-or-public/destructive-action'] : [],
    },
    rollback: workflow.rollback,
  };
}
