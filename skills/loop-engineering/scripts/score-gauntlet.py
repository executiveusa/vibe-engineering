#!/usr/bin/env python3
import json,sys
from pathlib import Path
if len(sys.argv)<2: raise SystemExit('usage: score-gauntlet.py scorecard.json')
d=json.loads(Path(sys.argv[1]).read_text())
mode=d.get('mode','universal')
weights={
'user_commercial_value':15,'correctness':15,'architecture_wiring':10,'usability_clarity':10,
'security_privacy':10,'reliability_recovery':10,'evidence_test_quality':10,'performance':5,
'accessibility_inclusion':5,'taste_distinction':5,'sovereignty_rollback':5}
if mode=='web':
    weights={'strategy_positioning':12,'customer_understanding':8,'content':10,'information_architecture':8,'usability':14,'visual_design':12,'originality_art_direction':12,'responsive_design':7,'accessibility':7,'performance_reliability':5,'conversion_proof':3,'ownership_rollback':2}
s=d.get('scores',{})
missing=[k for k in weights if k not in s]
if missing: raise SystemExit('missing scores: '+', '.join(missing))
for k,v in s.items():
    if k in weights and not (0<=float(v)<=10): raise SystemExit(f'bad score {k}: {v}')
score=sum(float(s[k])*w for k,w in weights.items())/100
hard=(d.get('critical_failures',0)==0 and d.get('unsupported_claims',0)==0 and d.get('rollback_documented',False))
if mode=='universal': hard=hard and all(float(s[k])>=9 for k in ['correctness','security_privacy','reliability_recovery'])
if mode=='web': hard=hard and all(float(s[k])>=8.5 for k in ['usability','visual_design','originality_art_direction','accessibility']) and float(s['conversion_proof'])>=9
passed=score>=8.5 and hard
print(json.dumps({'mode':mode,'weighted_score':round(score,3),'hard_floors_pass':hard,'release_score_pass':passed},indent=2))
raise SystemExit(0 if passed else 2)
