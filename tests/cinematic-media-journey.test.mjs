import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const main = await readFile(new URL('../src/main.jsx', import.meta.url), 'utf8');
const media = await readFile(new URL('../src/media-journey.js', import.meta.url), 'utf8');
const css = await readFile(new URL('../src/media-journey.css', import.meta.url), 'utf8');

test('cinematic media layer is mounted without replacing the filesystem-first app', () => {
  assert.match(main, /import '\.\/media-journey'/);
  for (const slot of ['scene-idea', 'scene-bar', 'scene-icm', 'scene-verify', 'image', 'video', 'saas', 'design']) {
    assert.match(media, new RegExp(`['\"]?${slot.replace('-', '\\-')}['\"]?`));
  }
});

test('cinematic media is responsive, lazy in practice, and reduced-motion aware', () => {
  assert.match(media, /IntersectionObserver/);
  assert.match(media, /preload = 'metadata'/);
  assert.match(media, /max-width: 600px/);
  assert.match(media, /prefers-reduced-motion: reduce/);
  assert.match(media, /video\.pause\(\)/);
  assert.match(css, /@media \(max-width: 600px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test('Fal media stays silent so the owner-controlled soundtrack remains the audio clock', () => {
  assert.match(media, /video\.muted = true/);
  assert.match(media, /video\.defaultMuted = true/);
  assert.match(media, /video\.loop = true/);
  assert.match(media, /video\.playsInline = true/);
});
