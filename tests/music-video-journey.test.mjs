import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
const css = await readFile(new URL('../src/studio.css', import.meta.url), 'utf8');
const timeline = await readFile(new URL('../src/music-timeline.js', import.meta.url), 'utf8');
const architecture = await readFile(new URL('../docs/experience/MUSIC-VIDEO-ARCHITECTURE.md', import.meta.url), 'utf8');
const brandBoard = await readFile(new URL('../public/vibe-brand-board.svg', import.meta.url), 'utf8');

test('soundtrack starts behind an explicit visitor choice and remains toggleable', () => {
  assert.match(app, /Enter with sound/i);
  assert.match(app, /Continue silent/i);
  assert.match(app, /Turn soundtrack off/i);
  assert.match(app, /Turn soundtrack on/i);
  assert.match(app, /youtube\.com\/iframe_api/i);
  assert.match(app, /getCurrentTime/);
});

test('YouTube player fails closed and can retry without replacing React-owned host', () => {
  assert.match(app, /script\.addEventListener\('error', fail/);
  assert.match(app, /youtubeApiPromise = undefined/);
  assert.match(app, /\.catch\(\(\) => \{/);
  assert.match(app, /document\.createElement\('div'\)/);
  assert.match(app, /new YT\.Player\(mount/);
  assert.match(app, /host\.replaceChildren\(\)/);
  assert.match(app, /setApiAttempt/);
});

test('music video timing is derived from playback time and configurable beat metadata', () => {
  assert.match(timeline, /VITE_VIBE_SOUNDTRACK_BPM/);
  assert.match(timeline, /VITE_VIBE_SOUNDTRACK_BEAT_OFFSET/);
  assert.match(timeline, /VITE_VIBE_SOUNDTRACK_BEATS_PER_BAR/);
  assert.match(app, /msUntilNextBeat/);
  assert.match(app, /isDownbeat/);
  assert.match(app, /\?calibrate|calibrate/);
  assert.match(architecture, /Scroll decides where the visitor is in the story/i);
  assert.match(architecture, /soundtrack controls impact timing/i);
});

test('beat pre-roll waits for the configured first beat and slower tempos are not capped', () => {
  assert.match(timeline, /if \(seconds < timeline\.beatOffset\) return -1/);
  assert.match(timeline, /timeline\.beatOffset - seconds/);
  assert.match(timeline, /beatIndex >= 0/);
  assert.doesNotMatch(app, /Math\.min\(msUntilNextBeat/);
  assert.match(app, /soundRef\.current \? msUntilNextBeat/);
  assert.match(app, /\}, \[entered\]\);/);
});

test('mobile journey has explicit safe-area, touch-target, small-screen, and reduced-motion contracts', () => {
  assert.match(css, /env\(safe-area-inset-top\)/);
  assert.match(css, /\.sound-toggle\{[^}]*min-height:44px/s);
  assert.match(css, /@media\(max-width:820px\)/);
  assert.match(css, /@media\(max-width:600px\)/);
  assert.match(css, /@media\(max-width:390px\)/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
  assert.match(architecture, /no horizontal overflow at 320px/i);
  assert.match(architecture, /native 9:16 chain/i);
});

test('public visual identity stays inside Quiet Signal instead of reverting to neon', () => {
  assert.match(brandBoard, /#171512/i);
  assert.match(brandBoard, /#EFE8DC/i);
  assert.match(brandBoard, /#B65F3D/i);
  assert.match(brandBoard, /#7C3C27/i);
  assert.doesNotMatch(brandBoard, /#C9FF38/i);
  assert.doesNotMatch(css, /#C9FF38/i);
});

test('journey remains image-led and ends in the open-source product', () => {
  for (const word of ['IMAGE', 'VIDEO', 'SAAS', 'DESIGN']) assert.match(app, new RegExp(word));
  assert.match(app, /Get Vibe free/i);
  assert.match(app, /Files \+ folders/i);
  assert.match(app, /Verify It Before Everything\./i);
});

test('public story reflects operator-first copy and credits the ICM source', () => {
  assert.match(app, /Find your <em>vibe\.<\/em>/i);
  assert.match(app, /non-technical operators and founders/i);
  assert.match(app, /Jake Van Clief/i);
  assert.match(app, /We did not design ICM\. We use it because it works/i);
  assert.match(app, /Specific\.<br \/>Secure\.<br \/>Useful\.<br \/>Sovereign\.<br \/>Repeatable\./i);
});

test('five-link resource rail reserves Substack and media slots are ready for generated video', () => {
  assert.match(app, /VITE_VIBE_SUBSTACK_URL/);
  for (const label of ['01 / Get Vibe free', '02 / Live skills API', '03 / Read AGENTS.md', '04 / Substack', '05 / Brand system']) {
    assert.match(app, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
  assert.match(app, /data-media-slot=\{`scene-\$\{scene\.id\}`\}/);
  for (const id of ['idea', 'bar', 'icm', 'verify']) assert.match(app, new RegExp(`id: '${id}'`));
  for (const slot of ['image', 'video', 'saas', 'design']) assert.match(app, new RegExp(`data-media-slot="${slot}"`, 'i'));
});
