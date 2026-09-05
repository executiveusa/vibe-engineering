# 09_release — ship with proof and rollback

One job: release the exact verified revision without losing owner control.

## Inputs
- Working: `GAUNTLET.md`, `GATES.md`, `ROLLBACK.md`, exact revision
- Reference: `_shared/standards/release.md`

## Process
1. Assemble an approval packet: change, evidence, risk, cost, affected systems, exact revision, rollback.
2. Require owner approval for production/irreversible release.
3. Deploy only the approved revision.
4. Verify production runtime: exact revision, primary journey, critical wiring/data, error signal.
5. If verification fails, execute rollback/stop plan and record evidence.
6. Set `PRODUCTION VERIFIED` only after runtime proof.

## Outputs
- `APPROVAL.md`
- `RECEIPT.md`
- Production evidence in `VERIFY-PRODUCTION.md`
- `STATE.md` -> `next_stage: 10_learn` when production verified

## Human check
Approve production release (or explicitly keep it at preview). This is mandatory.
