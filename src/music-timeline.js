const env = import.meta.env || {};

function numberFromEnv(name, fallback) {
  const value = Number(env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function positiveIntegerFromEnv(name, fallback) {
  const value = Number(env[name]);
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

export const MUSIC_TIMELINE = Object.freeze({
  // 96.774 BPM preserves the previous .62s visual pulse as a safe fallback.
  // For release-grade sync, calibrate the owner-authorized track and set the env values below.
  bpm: numberFromEnv('VITE_VIBE_SOUNDTRACK_BPM', 96.7741935484),
  beatOffset: Number.isFinite(Number(env.VITE_VIBE_SOUNDTRACK_BEAT_OFFSET))
    ? Number(env.VITE_VIBE_SOUNDTRACK_BEAT_OFFSET)
    : 0,
  beatsPerBar: positiveIntegerFromEnv('VITE_VIBE_SOUNDTRACK_BEATS_PER_BAR', 4),
});

export function beatDurationSeconds(bpm = MUSIC_TIMELINE.bpm) {
  return 60 / bpm;
}

export function beatIndexAt(seconds, timeline = MUSIC_TIMELINE) {
  if (seconds < timeline.beatOffset) return -1;
  const duration = beatDurationSeconds(timeline.bpm);
  return Math.floor((seconds - timeline.beatOffset) / duration);
}

export function msUntilNextBeat(seconds, timeline = MUSIC_TIMELINE) {
  if (seconds < timeline.beatOffset) {
    return Math.max(0, (timeline.beatOffset - seconds) * 1000);
  }
  const duration = beatDurationSeconds(timeline.bpm);
  const shifted = seconds - timeline.beatOffset;
  const phase = shifted % duration;
  if (phase < 0.012 || duration - phase < 0.012) return 0;
  return Math.max(0, (duration - phase) * 1000);
}

export function isDownbeat(beatIndex, timeline = MUSIC_TIMELINE) {
  return beatIndex >= 0 && beatIndex % timeline.beatsPerBar === 0;
}
