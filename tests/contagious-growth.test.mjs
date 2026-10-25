import test from 'node:test';
import assert from 'node:assert/strict';
import { getSkill, listSkills, runSkill } from '../src/skills/index.mjs';
import { CONTAGIOUS_SKILLS } from '../src/skills/contagious.mjs';
test('handcrafted skills route via canonical catalog',()=>{assert.equal(CONTAGIOUS_SKILLS.length,10);assert.equal(new Set(CONTAGIOUS_SKILLS.map(s=>s.id)).size,10);for(const s of CONTAGIOUS_SKILLS){assert.equal(getSkill(s.id)?.handcrafted,true);assert.ok(listSkills().find(x=>x.id===s.id));assert.equal(runSkill(s.id)?.execution.mode,'agent-procedure');}assert.ok(getSkill('proof'));});
