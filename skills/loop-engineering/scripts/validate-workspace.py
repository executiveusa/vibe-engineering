#!/usr/bin/env python3
from pathlib import Path
import sys
root=Path(sys.argv[1] if len(sys.argv)>1 else '.').resolve()
errors=[]
for f in ['SKILL.md','AGENTS.md','CONTEXT.md','_shared/routing/skill-router.md','_shared/standards/bar-and-gauntlet.md']:
    if not (root/f).is_file(): errors.append(f'missing {f}')
stages=sorted((root/'stages').glob('*/CONTEXT.md')) if (root/'stages').exists() else []
if len(stages)<10: errors.append(f'expected >=10 stage contracts, found {len(stages)}')
for p in stages:
    t=p.read_text(encoding='utf-8')
    for h in ['## Inputs','## Process','## Outputs','## Human check']:
        if h not in t: errors.append(f'{p.relative_to(root)} missing {h}')
for f in ['STATE.md','BAR.md','PROJECT-LOCK.md','GRAPH.md','SPEC.md','GATES.md','ROLLBACK.md','RECEIPT.md']:
    if not (root/'_templates'/'RUN'/f).is_file(): errors.append(f'missing run template {f}')
if errors:
    print('FAIL')
    for e in errors: print('-',e)
    raise SystemExit(1)
print(f'PASS: {len(stages)} stage contracts; required routers/templates present')
