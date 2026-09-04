# Release standard

A release is a controlled transition, not a build command.

Required before production:
- exact tested revision/SHA recorded;
- acceptance gates pass from current evidence;
- security/authority boundary reviewed;
- data migrations have backup/restore or safe forward fix;
- owner controls repo, domain, hosting, database, credentials, and export path where applicable;
- rollback target and procedure are tested or mechanically credible;
- public/runtime smoke test plan exists;
- owner production approval is recorded.

After deployment:
1. verify exact revision;
2. run primary user journey in production;
3. run critical API/data/wiring checks;
4. confirm monitoring/error signal;
5. capture evidence;
6. only then mark `PRODUCTION VERIFIED`.

If production verification fails, roll back or stop according to the recorded rollback plan. Never relabel a failed deployment as complete.
