// Report the factory's exit verdict for one StarNet intake (pauli-starnet POST /v1/factory/intake/settle).
// "done" is sent only when the exit bar passed (factory/exit-bar.mjs), with the receipt paths that prove it; the
// gateway refuses "done" without both the Judge and the security receipt. Anything else reports "failed".
// Env: STARNET_GATEWAY_URL, STARNET_GATEWAY_TOKEN, INTAKE_ID, JUDGED_COMMIT, EXIT_DECISION (SHIP|HOLD),
//      SECURITY_RECEIPT (path under docs/, e.g. evidence/<sha>/07-security-run-2.json).

export function settleBody({ intakeId, commit, decision, securityReceipt }) {
  const sha = String(commit || '');
  const body = {
    intake_id: String(intakeId || ''),
    status: decision === 'SHIP' ? 'done' : 'failed',
    evidence: {},
  };
  if (body.status === 'done') {
    body.evidence = {
      judge_receipt: `evidence/${sha}/06-judge.json`,
      security_receipt: String(securityReceipt || ''),
    };
  }
  return body;
}

async function main() {
  const e = process.env;
  const base = String(e.STARNET_GATEWAY_URL || '').replace(/\/+$/, '');
  if (!base || !e.STARNET_GATEWAY_TOKEN) {
    console.log('StarNet gateway not configured: nothing reported');
    return;
  }
  const body = settleBody({
    intakeId: e.INTAKE_ID,
    commit: e.JUDGED_COMMIT,
    decision: e.EXIT_DECISION,
    securityReceipt: e.SECURITY_RECEIPT,
  });
  const res = await fetch(base + '/v1/factory/intake/settle', {
    method: 'POST',
    headers: {
      authorization: 'Bearer ' + e.STARNET_GATEWAY_TOKEN,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  console.log(
    JSON.stringify({ reported: body.status, intake_id: body.intake_id, http: res.status }),
  );
  if (!res.ok) process.exit(1);
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
