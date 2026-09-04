#!/usr/bin/env python3
from pathlib import Path
import argparse, shutil, datetime, re
p=argparse.ArgumentParser()
p.add_argument('name')
p.add_argument('--root',default='.')
a=p.parse_args()
root=Path(a.root).resolve()
slug=re.sub(r'[^a-z0-9]+','-',a.name.lower()).strip('-') or 'run'
stamp=datetime.datetime.now().strftime('%Y%m%d-%H%M%S')
dest=root/'runs'/f'{stamp}-{slug}'
src=root/'_templates'/'RUN'
if not src.exists(): raise SystemExit('missing _templates/RUN')
shutil.copytree(src,dest)
print(dest)
