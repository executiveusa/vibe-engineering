import './media-journey.css';

const MEDIA = Object.freeze({
  'scene-idea': {
    desktop: 'https://v3b.fal.media/files/b/0aa8f1ad/YBHF-Mb0Xkohge5MB2s_-_video.mp4',
    mobile: 'https://v3b.fal.media/files/b/0aa8f19a/5Bma_425CcaDzUkG5ThEH_video.mp4',
  },
  'scene-bar': {
    desktop: 'https://v3b.fal.media/files/b/0aa8f195/heqaXnuwW5nRe3oXHYPWX_video.mp4',
    mobile: 'https://v3b.fal.media/files/b/0aa8f1b7/PdmNBnqm4C6UxnoL4CGGu_video.mp4',
  },
  'scene-icm': {
    desktop: 'https://v3b.fal.media/files/b/0aa8f199/aYMsqx6MKnnmmHOHFZxDS_video.mp4',
    mobile: 'https://v3b.fal.media/files/b/0aa8f19e/1sj90rpprndqNLnN4Dhy0_video.mp4',
  },
  'scene-verify': {
    desktop: 'https://v3b.fal.media/files/b/0aa8f19b/R8zBT7p_00spX_fPX41wd_video.mp4',
    mobile: 'https://v3b.fal.media/files/b/0aa8f1a5/WfC4CZSzryh7QogLI5E2k_video.mp4',
  },
  image: {
    desktop: 'https://v3b.fal.media/files/b/0aa8f1b9/C8G87G3BskHiQBWk1LUoJ_video.mp4',
    mobile: 'https://v3b.fal.media/files/b/0aa8f1b9/C8G87G3BskHiQBWk1LUoJ_video.mp4',
  },
  video: {
    desktop: 'https://v3b.fal.media/files/b/0aa8f19b/R8zBT7p_00spX_fPX41wd_video.mp4',
    mobile: 'https://v3b.fal.media/files/b/0aa8f1a5/WfC4CZSzryh7QogLI5E2k_video.mp4',
  },
  saas: {
    desktop: 'https://v3b.fal.media/files/b/0aa8f199/aYMsqx6MKnnmmHOHFZxDS_video.mp4',
    mobile: 'https://v3b.fal.media/files/b/0aa8f19e/1sj90rpprndqNLnN4Dhy0_video.mp4',
  },
  design: {
    desktop: 'https://v3b.fal.media/files/b/0aa8f195/heqaXnuwW5nRe3oXHYPWX_video.mp4',
    mobile: 'https://v3b.fal.media/files/b/0aa8f1b7/PdmNBnqm4C6UxnoL4CGGu_video.mp4',
  },
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobileQuery = window.matchMedia('(max-width: 600px)');
const mounted = new WeakSet();
const videos = new Set();

function selectedSource(config) {
  return mobileQuery.matches ? config.mobile : config.desktop;
}

function applySource(video, config) {
  const next = selectedSource(config);
  if (!next || video.dataset.source === next) return;
  const wasPlaying = !video.paused;
  video.dataset.source = next;
  video.src = next;
  video.load();
  if (wasPlaying && !reduceMotion.matches) video.play().catch(() => {});
}

function buildVideo(slot, config) {
  const video = document.createElement('video');
  video.className = 'journey-media';
  video.dataset.mediaKey = slot;
  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'metadata';
  video.tabIndex = -1;
  video.setAttribute('aria-hidden', 'true');
  video.disablePictureInPicture = true;
  applySource(video, config);
  return video;
}

const observer = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const video = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio > 0.18 && !reduceMotion.matches) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    }, { threshold: [0, 0.18, 0.5] })
  : null;

function mountMedia(node) {
  if (!(node instanceof HTMLElement) || mounted.has(node)) return;
  const slot = node.dataset.mediaSlot;
  const config = MEDIA[slot];
  if (!config) return;

  const video = buildVideo(slot, config);
  node.prepend(video);
  node.classList.add('has-cinematic-media');
  mounted.add(node);
  videos.add(video);
  observer?.observe(video);

  if (!observer && !reduceMotion.matches) video.play().catch(() => {});
}

function scan(root = document) {
  root.querySelectorAll?.('[data-media-slot]').forEach(mountMedia);
}

function refreshSources() {
  for (const video of videos) {
    const config = MEDIA[video.dataset.mediaKey];
    if (config) applySource(video, config);
  }
}

function enforceMotionPreference() {
  for (const video of videos) {
    if (reduceMotion.matches) {
      video.pause();
      if (Number.isFinite(video.duration) && video.duration > 0) video.currentTime = Math.min(0.05, video.duration);
    }
  }
}

scan();

const mutationObserver = new MutationObserver((records) => {
  for (const record of records) {
    for (const node of record.addedNodes) {
      if (!(node instanceof HTMLElement)) continue;
      if (node.matches?.('[data-media-slot]')) mountMedia(node);
      scan(node);
    }
  }
});

mutationObserver.observe(document.documentElement, { childList: true, subtree: true });
mobileQuery.addEventListener?.('change', refreshSources);
reduceMotion.addEventListener?.('change', enforceMotionPreference);
