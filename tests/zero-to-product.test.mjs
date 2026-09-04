import assert from 'node:assert/strict';
import test from 'node:test';
import { SKILLS, getSkill } from '../src/skills/index.mjs';
import { ZERO_TO_PRODUCT_SKILL_IDS, ZERO_TO_PRODUCT_WORKFLOW } from '../src/workflows/zero-to-product.mjs';

test('zero-to-product workflow covers every callable Vibe skill', () => {
  const registered = new Set(SKILLS.map((skill) => skill.id));
  const journey = new Set(ZERO_TO_PRODUCT_SKILL_IDS);
  assert.equal(registered.size, 32);
  assert.deepEqual([...registered].filter((id) => !journey.has(id)), []);
  assert.deepEqual([...journey].filter((id) => !registered.has(id)), []);
});

test('review skill is OpenCodeReview-first and cannot self-authorize release', () => {
  const review = getSkill('review');
  assert.equal(ZERO_TO_PRODUCT_WORKFLOW.reviewEngine.role, 'primary-code-review-engine');
  assert.equal(ZERO_TO_PRODUCT_WORKFLOW.reviewEngine.repository, 'https://github.com/executiveusa/open-code-review');
  assert.match(review.summary, /OpenCodeReview.*dominant/i);
  assert.ok(review.steps.some((step) => /ocr review --from/.test(step)));
  assert.ok(review.steps.some((step) => /deterministic file selection/.test(step)));
  assert.ok(review.steps.some((step) => /Review never authorizes release/.test(step)));
});

test('beginner workflow has a clear primary lane from setup through ship', () => {
  const primary = ZERO_TO_PRODUCT_WORKFLOW.phases.flatMap((phase) => phase.primary);
  assert.equal(ZERO_TO_PRODUCT_WORKFLOW.phases[0].id, '00-start');
  assert.equal(ZERO_TO_PRODUCT_WORKFLOW.phases.at(-1).id, '09-learn');
  for (const required of ['setup-vibe', 'grill-idea', 'grill', 'spec', 'tickets', 'build', 'review', 'project-review', 'proof', 'merge', 'ship']) {
    assert.ok(primary.includes(required), `missing primary skill ${required}`);
  }
});
