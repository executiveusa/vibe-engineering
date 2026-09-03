import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './studio.css';

gsap.registerPlugin(ScrollTrigger);

const REPO = 'https://github.com/executiveusa/vibe-engineering';
const TRACK = (import.meta.env.VITE_VIBE_SOUNDTRACK_URL || 'https://www.youtube.com/embed/MxgOjbhG2Go').trim();

function getYouTubeId(url) {
  if (!url) return '';
  const embed = url.match(/youtube\.com\/embed\/([A-Za-z0-9_-]+)/);
  if (embed?.[1]) return embed[1];
  const watch = url.match(/[?&]v=([A-Za-z0-9_-]+)/);
  if (watch?.[1]) return watch[1];
  const short = url.match(/youtu\.be\/([A-Za-z0-9_-]+)/);
  return short?.[1] || '';
}

function Mark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="mark-svg">
      <path d="M9 11h10l13 34 13-34h10L36 54h-8L9 11Z" fill="currentColor" />
      <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".28" />
    </svg>
  );
}

function SoundSystem({ playing, setPlaying }) {
  const youtubeId = useMemo(() => getYouTubeId(TRACK), []);
  const audioRef = useRef(null);
  const toggle = async () => {
    if (youtubeId) return setPlaying((value) => !value);
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }
    audioRef.current.volume = 0.48;
    try {
      await audioRef.current.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };
  const youtubeSrc = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}&controls=0&rel=0&playsinline=1`
    : '';
  return (
    <>
      {youtubeId && playing ? <iframe className="sound-iframe" title="Vibe Engineering soundtrack" src={youtubeSrc} allow="autoplay" aria-hidden="true" tabIndex="-1" /> : null}
      {!youtubeId && TRACK ? <audio ref={audioRef} src={TRACK} loop preload="none" /> : null}
      <button type="button" className={`sound-toggle ${playing ? 'is-on' : ''}`} onClick={toggle} aria-pressed={playing}>
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
        <span>The experience works either way. Sound is always your choice.</span>
        <div className="entry-actions">
          <button type="button" onClick={onSound}>Enter with sound <b>↗</b></button>
          <button type="button" className="quiet" onClick={onSilent}>Continue silent</button>
        </div>
      </div>
    </div>
  );
}

function OutputWorld() {
  return (
    <svg className="world-svg" viewBox="0 0 900 680" role="img" aria-label="Illustrated world of image, video, software and design outputs">
      <defs>
        <filter id="shadow"><feDropShadow dx="0" dy="18" stdDeviation="16" floodOpacity=".18" /></filter>
      </defs>
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

const SCENES = [
  { id: 'idea', eyebrow: '01 / THE SHIFT', title: <>AI can make almost <em>anything.</em></>, copy: 'Images. Video. SaaS. Websites. Agents. Brands. The new problem is not access to tools. It is knowing what good should be—and proving you got there.', visual: <OutputWorld />, caption: 'NOT JUST SOFTWARE. A WAY OF MAKING.' },
  { id: 'bar', eyebrow: '02 / SET THE BAR', title: <>Do not ask AI to decide <em>good.</em></>, copy: 'Show it the target. Name the standard. Keep your point of view. Vibe gives every build something real to aim at before the first draft becomes the default.', visual: <BarVisual />, caption: 'INTENT → STANDARD → EVIDENCE' },
  { id: 'icm', eyebrow: '03 / KEEP IT WALKABLE', title: <>The method lives in <em>files.</em></>, copy: 'ICM keeps the work understandable. Any capable agent can enter the same project, read the same laws, find the current stage, and continue without a swarm of personalities.', visual: <IcmVisual />, caption: 'ONE SYSTEM. ANY AGENT.' },
  { id: 'verify', eyebrow: '04 / THE HABIT', title: <>Verify It Before <em>Everything.</em></>, copy: 'Check the idea before scale. Check the design before polish. Check the code before release. Check the proof before the claim. The system does the heavy work; you keep the final call.', visual: <ProofVisual />, caption: 'MAKE → CHECK → PROVE → DECIDE' },
];

function App() {
  const page = useRef(null);
  const [entered, setEntered] = useState(false);
  const [sound, setSound] = useState(false);

  useEffect(() => {
    if (!entered || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('.hero-lockup > *', { y: 36, opacity: 0, duration: .9, stagger: .08, ease: 'power4.out' });
      gsap.utils.toArray('.story-scene').forEach((scene) => {
        const visual = scene.querySelector('.scene-visual');
        const copy = scene.querySelector('.scene-copy');
        gsap.fromTo(visual, { scale: .9, rotate: -1.4 }, { scale: 1.04, rotate: 1.2, ease: 'none', scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: 1 } });
        gsap.from(copy, { y: 56, opacity: 0, duration: .75, ease: 'power3.out', scrollTrigger: { trigger: scene, start: 'top 72%' } });
      });
      gsap.to('.journey-progress i', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: page.current, start: 'top top', end: 'bottom bottom', scrub: true } });
    }, page);
    return () => ctx.revert();
  }, [entered]);

  const enter = (withSound) => { setSound(withSound); setEntered(true); };

  return (
    <main ref={page} id="main-content" className={sound ? 'sound-active' : ''}>
      {!entered ? <EntryGate onSound={() => enter(true)} onSilent={() => enter(false)} /> : null}
      <a className="skip-link" href="#story">Skip to story</a>
      <div className="journey-progress" aria-hidden="true"><i /></div>
      <div className="journey-controls"><SoundSystem playing={sound} setPlaying={setSound} /><a href={REPO} target="_blank" rel="noreferrer">GitHub ↗</a></div>

      <section className="journey-hero" id="top">
        <div className="halftone" aria-hidden="true" />
        <nav className="nav journey-nav" aria-label="Primary navigation"><a className="brand" href="#top" aria-label="Vibe Engineering home"><Mark /><span>Vibe Engineering</span></a><span>SCROLL TO MOVE ↓</span></nav>
        <div className="hero-lockup">
          <p>FREE / OPEN SOURCE / BUILT FOR THE NEW WAVE</p>
          <h1>Build the vibe.<br /><em>Prove the result.</em></h1>
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
              <div className="scene-visual"><div className="comic-caption">{scene.caption}</div>{scene.visual}<div className="scene-number" aria-hidden="true">0{index + 1}</div></div>
            </div>
          </article>
        ))}
      </section>

      <section className="make-anything">
        <div className="make-shell">
          <p>05 / USE THE SAME METHOD</p>
          <h2>Image.<br />Video.<br />SaaS.<br />Design.</h2>
          <div className="make-copy"><p>The output changes. The discipline does not. Tell it what you want. Set the bar. Make it. Check it. Prove it.</p><div className="mini-flow"><span>TELL IT</span><b>→</b><span>SET THE BAR</span><b>→</b><span>MAKE IT</span><b>→</b><span>PROVE IT</span></div></div>
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
