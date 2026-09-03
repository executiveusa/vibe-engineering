import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  MUSIC_TIMELINE,
  beatDurationSeconds,
  beatIndexAt,
  isDownbeat,
  msUntilNextBeat,
} from './music-timeline';
import './studio.css';

gsap.registerPlugin(ScrollTrigger);

const REPO = 'https://github.com/executiveusa/vibe-engineering';
const TRACK = (import.meta.env.VITE_VIBE_SOUNDTRACK_URL || 'https://www.youtube.com/embed/MxgOjbhG2Go').trim();
let youtubeApiPromise;

function getYouTubeId(url) {
  if (!url) return '';
  const embed = url.match(/youtube\.com\/embed\/([A-Za-z0-9_-]+)/);
  if (embed?.[1]) return embed[1];
  const watch = url.match(/[?&]v=([A-Za-z0-9_-]+)/);
  if (watch?.[1]) return watch[1];
  const short = url.match(/youtu\.be\/([A-Za-z0-9_-]+)/);
  return short?.[1] || '';
}

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    let script = document.querySelector('script[data-vibe-youtube-api]');
    let settled = false;

    const finish = (callback, value) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      script?.removeEventListener('error', fail);
      callback(value);
    };

    const fail = () => {
      youtubeApiPromise = undefined;
      if (script?.dataset.vibeYoutubeApi === 'true') script.remove();
      finish(reject, new Error('YouTube IFrame API failed to load'));
    };

    window.onYouTubeIframeAPIReady = () => {
      if (typeof previous === 'function') previous();
      if (window.YT?.Player) finish(resolve, window.YT);
      else fail();
    };

    if (!script) {
      script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.dataset.vibeYoutubeApi = 'true';
      document.head.appendChild(script);
    }
    script.addEventListener('error', fail, { once: true });

    const timeout = window.setTimeout(fail, 12000);
  });

  return youtubeApiPromise;
}

function Mark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="mark-svg">
      <path d="M9 11h10l13 34 13-34h10L36 54h-8L9 11Z" fill="currentColor" />
      <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".28" />
    </svg>
  );
}

function SoundSystem({ playing, setPlaying, onTime }) {
  const youtubeId = useMemo(() => getYouTubeId(TRACK), []);
  const playerHostRef = useRef(null);
  const playerRef = useRef(null);
  const audioRef = useRef(null);
  const playingRef = useRef(playing);
  const [apiAttempt, setApiAttempt] = useState(0);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    if (!youtubeId || !playerHostRef.current) return undefined;
    let cancelled = false;
    let timer;
    const host = playerHostRef.current;
    const mount = document.createElement('div');
    host.replaceChildren(mount);

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !host.isConnected) return;
        playerRef.current = new YT.Player(mount, {
          videoId: youtubeId,
          width: 1,
          height: 1,
          playerVars: {
            autoplay: playingRef.current ? 1 : 0,
            controls: 0,
            disablekb: 1,
            loop: 1,
            playlist: youtubeId,
            playsinline: 1,
            rel: 0,
          },
          events: {
            onReady: (event) => {
              event.target.setVolume(48);
              if (playingRef.current) event.target.playVideo();
            },
            onError: () => setPlaying(false),
          },
        });
        timer = window.setInterval(() => {
          const time = playerRef.current?.getCurrentTime?.();
          if (Number.isFinite(time)) onTime(time);
        }, 50);
      })
      .catch(() => {
        if (!cancelled) setPlaying(false);
      });

    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
      try {
        playerRef.current?.destroy?.();
      } catch {
        // The YouTube API can already have removed its iframe during teardown.
      }
      playerRef.current = null;
      host.replaceChildren();
    };
  }, [youtubeId, onTime, setPlaying, apiAttempt]);

  useEffect(() => {
    if (youtubeId) {
      if (!playerRef.current) return;
      if (playing) playerRef.current.playVideo?.();
      else playerRef.current.pauseVideo?.();
      return;
    }
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.volume = 0.48;
      audioRef.current.play().catch(() => setPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [playing, youtubeId, setPlaying]);

  useEffect(() => {
    if (youtubeId || !audioRef.current) return undefined;
    let frame;
    const tick = () => {
      onTime(audioRef.current?.currentTime || 0);
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [youtubeId, onTime]);

  const toggle = () => {
    if (youtubeId && !playing && !playerRef.current) setApiAttempt((value) => value + 1);
    setPlaying((value) => !value);
  };

  return (
    <>
      {youtubeId ? <div className="sound-player" ref={playerHostRef} aria-hidden="true" /> : null}
      {!youtubeId && TRACK ? <audio ref={audioRef} src={TRACK} loop preload="metadata" /> : null}
      <button
        type="button"
        className={`sound-toggle ${playing ? 'is-on' : ''}`}
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? 'Turn soundtrack off' : 'Turn soundtrack on'}
      >
        <span className="sound-bars" aria-hidden="true"><i /><i /><i /></span>
        <span>{playing ? 'Sound on' : 'Sound off'}</span>
      </button>
    </>
  );
}

function EntryGate({ onSound, onSilent }) {
  return (
    <div className="entry-gate" role="dialog" aria-modal="true" aria-labelledby="entry-title">
      <div className="entry-card">
        <p>VIBE ENGINEERING / CLIENT ZERO</p>
        <h1 id="entry-title">This is a scroll story.<br /><em>Pick your vibe.</em></h1>
        <span>Sound turns the page into a music-video journey. Silent mode keeps the same story and every control.</span>
        <div className="entry-actions">
          <button type="button" onClick={onSound}>Enter with sound <b>↗</b></button>
          <button type="button" className="quiet" onClick={onSilent}>Continue silent</button>
        </div>
      </div>
    </div>
  );
}

function BeatCalibration({ currentTime }) {
  const [taps, setTaps] = useState([]);
  const [result, setResult] = useState(null);
  const enabled = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('calibrate') === '1';
  if (!enabled) return null;

  const tap = () => {
    const next = [...taps, currentTime.current].slice(-9);
    setTaps(next);
    if (next.length >= 5) {
      const intervals = next.slice(1).map((value, index) => value - next[index]).filter((value) => value > .2 && value < 1.5);
      if (intervals.length >= 4) {
        const average = intervals.reduce((sum, value) => sum + value, 0) / intervals.length;
        const bpm = 60 / average;
        const beat = 60 / bpm;
        const offset = ((next[0] % beat) + beat) % beat;
        setResult({ bpm, offset });
      }
    }
  };

  return (
    <aside className="beat-calibrator">
      <strong>Beat calibration</strong>
      <span>Play the track and tap 8 steady beats.</span>
      <button type="button" onClick={tap}>Tap beat</button>
      <button type="button" className="quiet" onClick={() => { setTaps([]); setResult(null); }}>Reset</button>
      <code>{result ? `BPM ${result.bpm.toFixed(3)} / OFFSET ${result.offset.toFixed(3)}s` : `${taps.length}/8 taps`}</code>
    </aside>
  );
}

function OutputWorld() {
  return (
    <svg className="world-svg" viewBox="0 0 900 680" role="img" aria-label="Illustrated world of image, video, software and design outputs">
      <defs><filter id="shadow"><feDropShadow dx="0" dy="18" stdDeviation="16" floodOpacity=".18" /></filter></defs>
      <g className="float-a" filter="url(#shadow)"><rect x="70" y="105" width="300" height="190" rx="4" /><circle cx="170" cy="180" r="52" /><path d="M98 265l78-78 45 48 49-35 70 65z" /><text x="95" y="135">IMAGE</text></g>
      <g className="float-b" filter="url(#shadow)"><rect x="480" y="70" width="310" height="215" rx="4" /><rect x="505" y="105" width="260" height="145" rx="2" /><polygon points="608,145 608,210 668,178" /><text x="505" y="100">VIDEO</text></g>
      <g className="float-c" filter="url(#shadow)"><rect x="120" y="395" width="300" height="190" rx="4" /><rect x="150" y="438" width="240" height="110" rx="2" /><path d="M175 515h65v-48h52v48h76" /><text x="150" y="425">SAAS</text></g>
      <g className="float-d" filter="url(#shadow)"><rect x="510" y="380" width="270" height="205" rx="4" /><circle cx="585" cy="465" r="45" /><rect x="650" y="425" width="90" height="20" /><rect x="650" y="460" width="65" height="20" /><rect x="650" y="495" width="78" height="20" /><text x="535" y="410">DESIGN</text></g>
      <path className="orbit" d="M385 130c82 35 119 86 118 153M437 538c55-20 88-53 105-98M350 430c34-27 50-63 47-109" />
    </svg>
  );
}

function BarVisual() {
  return (
    <div className="bar-visual" aria-label="Reference bar comparison illustration">
      <div className="reference-panel"><span>THE BAR</span><strong>Specific.<br />Useful.<br />Yours.</strong><small>Set the result before the model decides for you.</small></div>
      <div className="compare-stack"><div className="compare-card reject"><span>FIRST TRY</span><b>Looks done.</b><i>REJECT</i></div><div className="compare-card proof"><span>VERIFIED</span><b>Proves it.</b><i>MOVE FORWARD</i></div></div>
    </div>
  );
}

function IcmVisual() {
  return (
    <div className="icm-visual" aria-label="ICM files and folders illustration">
      <div className="folder folder-a"><span>01</span><strong>AGENTS.md</strong><small>the law</small></div>
      <div className="folder folder-b"><span>02</span><strong>ICMR.yaml</strong><small>the map</small></div>
      <div className="folder folder-c"><span>03</span><strong>CONTEXT.md</strong><small>where you are</small></div>
      <div className="folder folder-d"><span>04</span><strong>PROOF/</strong><small>what is true</small></div>
      <div className="icm-center"><b>ICM</b><span>files + folders<br />not agent soup</span></div>
    </div>
  );
}

function ProofVisual() {
  return (
    <div className="proof-visual" aria-label="Verification checkpoint illustration">
      <div className="proof-ring"><span>VERIFY</span><b>IT</b><span>BEFORE</span><b>EVERYTHING</b></div>
      <div className="proof-stamps"><i>CHECK</i><i>TEST</i><i>TASTE</i><i>PROVE</i></div>
    </div>
  );
}

function OutputPosters() {
  return (
    <div className="output-posters" aria-label="Four examples of what Vibe Engineering can help create">
      <article className="output-poster poster-image"><span>IMAGE</span><div className="poster-art"><i /><b /></div><small>Concept → reference → render → verify</small></article>
      <article className="output-poster poster-video"><span>VIDEO</span><div className="poster-art"><i /><b /></div><small>Story → shots → edit → proof</small></article>
      <article className="output-poster poster-saas"><span>SAAS</span><div className="poster-art"><i /><b /></div><small>Outcome → system → build → test</small></article>
      <article className="output-poster poster-design"><span>DESIGN</span><div className="poster-art"><i /><b /></div><small>Intent → bar → taste → refine</small></article>
    </div>
  );
}

const SCENES = [
  { id: 'idea', eyebrow: '01 / THE SHIFT', title: <>AI can make almost <em>anything.</em></>, copy: 'Images. Video. SaaS. Websites. Agents. Brands. The new problem is not access to tools. It is knowing what good should be—and proving you got there.', visual: <OutputWorld />, caption: 'NOT JUST SOFTWARE. A WAY OF MAKING.' },
  { id: 'bar', eyebrow: '02 / SET THE BAR', title: <>Do not ask AI to decide <em>good.</em></>, copy: 'Show it the target. Name the standard. Keep your point of view. Vibe gives every build something real to aim at before the first draft becomes the default.', visual: <BarVisual />, caption: 'INTENT → STANDARD → EVIDENCE' },
  { id: 'icm', eyebrow: '03 / KEEP IT WALKABLE', title: <>The method lives in <em>files.</em></>, copy: 'ICM keeps the work understandable. Any capable agent can enter the same project, read the same laws, find the current stage, and continue without a swarm of personalities.', visual: <IcmVisual />, caption: 'ONE SYSTEM. ANY AGENT.' },
  { id: 'verify', eyebrow: '04 / THE HABIT', title: <>Verify It Before <em>Everything.</em></>, copy: 'Check the idea before scale. Check the design before polish. Check the code before release. Check the proof before the claim. The system does the heavy work; you keep the final call.', visual: <ProofVisual />, caption: 'MAKE → CHECK → PROVE → DECIDE' },
];

function App() {
  const page = useRef(null);
  const currentTime = useRef(0);
  const soundRef = useRef(false);
  const [entered, setEntered] = useState(false);
  const [sound, setSound] = useState(false);

  const updateTrackTime = useMemo(() => (seconds) => {
    currentTime.current = seconds;
  }, []);

  useEffect(() => {
    soundRef.current = sound;
  }, [sound]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = entered ? previousOverflow : 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [entered]);

  useEffect(() => {
    document.documentElement.style.setProperty('--beat-duration', `${beatDurationSeconds(MUSIC_TIMELINE.bpm)}s`);
  }, []);

  useEffect(() => {
    if (!entered || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timers = [];
    const scheduleImpact = (scene) => {
      const delay = soundRef.current ? msUntilNextBeat(currentTime.current) : 0;
      const timer = window.setTimeout(() => {
        const stage = scene.querySelector('.visual-stage');
        const title = scene.querySelector('h2');
        const caption = scene.querySelector('.comic-caption');
        gsap.timeline()
          .fromTo(stage, { scale: .985 }, { scale: 1, duration: .34, ease: 'back.out(2)' })
          .fromTo(title, { y: 10 }, { y: 0, duration: .28, ease: 'power3.out' }, '<')
          .fromTo(caption, { x: -10, opacity: .65 }, { x: 0, opacity: 1, duration: .25, ease: 'power2.out' }, '<');
      }, delay);
      timers.push(timer);
    };

    const ctx = gsap.context(() => {
      gsap.from('.hero-lockup > *', { y: 36, opacity: 0, duration: .9, stagger: .08, ease: 'power4.out' });
      gsap.utils.toArray('.story-scene').forEach((scene) => {
        const visual = scene.querySelector('.scene-visual');
        const copy = scene.querySelector('.scene-copy');
        gsap.fromTo(visual, { scale: .92, rotate: -1 }, { scale: 1.025, rotate: .5, ease: 'none', scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: .75 } });
        gsap.from(copy, { y: 48, opacity: 0, duration: .7, ease: 'power3.out', scrollTrigger: { trigger: scene, start: 'top 74%' } });
        ScrollTrigger.create({ trigger: scene, start: 'top 66%', onEnter: () => scheduleImpact(scene), onEnterBack: () => scheduleImpact(scene) });
      });
      gsap.to('.journey-progress i', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: page.current, start: 'top top', end: 'bottom bottom', scrub: true } });
      gsap.from('.output-poster', { y: 42, opacity: 0, stagger: .08, duration: .55, ease: 'power3.out', scrollTrigger: { trigger: '.output-posters', start: 'top 78%' } });
    }, page);
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      ctx.revert();
    };
  }, [entered]);

  useEffect(() => {
    if (!entered || !sound || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let frame;
    let lastBeat = -1;
    const tick = () => {
      const beat = beatIndexAt(currentTime.current);
      if (beat >= 0 && beat !== lastBeat) {
        lastBeat = beat;
        const downbeat = isDownbeat(beat);
        const targets = gsap.utils.toArray('.beat-reactive');
        gsap.fromTo(targets, { scale: 1 }, { scale: downbeat ? 1.018 : 1.008, duration: .08, yoyo: true, repeat: 1, ease: 'power2.out', overwrite: 'auto' });
        if (downbeat) gsap.fromTo('.beat-flash', { opacity: .09 }, { opacity: 0, duration: .32, ease: 'power2.out', overwrite: true });
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [entered, sound]);

  const enter = (withSound) => {
    setSound(withSound);
    setEntered(true);
  };

  return (
    <main ref={page} id="main-content" className={sound ? 'sound-active' : ''}>
      {!entered ? <EntryGate onSound={() => enter(true)} onSilent={() => enter(false)} /> : null}
      <a className="skip-link" href="#story">Skip to story</a>
      <div className="beat-flash" aria-hidden="true" />
      <div className="journey-progress" aria-hidden="true"><i /></div>
      <div className="journey-controls"><SoundSystem playing={sound} setPlaying={setSound} onTime={updateTrackTime} /><a href={REPO} target="_blank" rel="noreferrer">GitHub ↗</a></div>
      <BeatCalibration currentTime={currentTime} />

      <section className="journey-hero" id="top">
        <div className="halftone" aria-hidden="true" />
        <nav className="nav journey-nav" aria-label="Primary navigation"><a className="brand" href="#top" aria-label="Vibe Engineering home"><Mark /><span>Vibe Engineering</span></a><span>SCROLL TO MOVE ↓</span></nav>
        <div className="hero-lockup">
          <p>FREE / OPEN SOURCE / BUILT FOR THE NEW WAVE</p>
          <div className="beat-reactive hero-title"><h1>Build the vibe.<br /><em>Prove the result.</em></h1></div>
          <p className="hero-copy">Vibe Engineering is a way to make things with AI without letting AI choose the standard for you.</p>
          <div className="hero-actions"><a className="primary-cta" href="#story">Start the journey ↓</a><a className="text-link" href={REPO} target="_blank" rel="noreferrer">Get Vibe free ↗</a></div>
        </div>
        <div className={`beat-line ${sound ? 'running' : ''}`} aria-hidden="true">{Array.from({ length: 16 }).map((_, index) => <i key={index} />)}</div>
      </section>

      <section id="story" className="story-world" aria-label="Vibe Engineering visual story">
        {SCENES.map((scene, index) => (
          <article className={`story-scene scene-${scene.id}`} key={scene.id}>
            <div className="scene-shell">
              <div className="scene-copy"><p>{scene.eyebrow}</p><h2>{scene.title}</h2><span>{scene.copy}</span></div>
              <div className="scene-visual"><div className="comic-caption">{scene.caption}</div><div className="visual-stage beat-reactive">{scene.visual}</div><div className="scene-number" aria-hidden="true">0{index + 1}</div></div>
            </div>
          </article>
        ))}
      </section>

      <section className="make-anything">
        <div className="make-shell">
          <p>05 / SAME METHOD. DIFFERENT OUTPUT.</p>
          <h2>Make more.<br /><em>Lower the guesswork.</em></h2>
          <div className="make-copy"><p>The output changes. The discipline does not. Tell it what you want. Set the bar. Make it. Check it. Prove it.</p><div className="mini-flow"><span>TELL IT</span><b>→</b><span>SET THE BAR</span><b>→</b><span>MAKE IT</span><b>→</b><span>PROVE IT</span></div></div>
          <OutputPosters />
        </div>
      </section>

      <section className="open-source-close">
        <div className="close-mark"><Mark /></div>
        <p>THE SYSTEM IS FREE</p>
        <h2>Use our process<br /><em>before you hire us.</em></h2>
        <p className="close-copy">Files + folders. Plugin. CLI. API. MCP. Claude Code, Codex, Cursor, OpenCode, or your own agent. No agent soup.</p>
        <div className="close-actions"><a className="primary-cta light-cta" href={REPO} target="_blank" rel="noreferrer">Get Vibe free ↗</a><a className="text-link" href="/api/v1/skills">See the live skills API ↗</a></div>
        <code>Read AGENTS.md. Follow Vibe. Verify It Before Everything.</code>
      </section>

      <footer><span>Vibe Engineering / The Pauli Effect</span><span>Verify It Before Everything.</span></footer>
    </main>
  );
}

export default App;
