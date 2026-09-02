import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './studio.css';

gsap.registerPlugin(ScrollTrigger);

const FLOW = ['Choose / See', 'Shape / Make', 'Prove / Challenge', 'Decide / Release / Learn'];
const STUDIO_REEL = [
  ['AGENT MAX', 'Agent systems'],
  ['MAX DIGITAL MEDIA', 'Web + commerce'],
  ['FUTURE CHAMPS', 'Community platform'],
  ['ASC3ND', 'Nonprofit systems'],
  ['FANNI', 'Enterprise agent'],
  ['SYNTHIA', 'Interactive worlds'],
  ['PV BUTTERFLIES', 'Local discovery'],
  ['NEW WORLD KIDS', 'Youth + learning'],
];
const HUMAN_GROUPS = [
  ['Understand me', 'Grill · Interview · Language · Explain · Research'],
  ['Figure it out', 'Map · Spec · Prototype · Architecture · Tickets'],
  ['Build it right', 'Build · Test · Debug · Module Design · Merge'],
  ['Don’t let it suck', 'Stop Slop · Human Voice · Taste · Deep Work · Review'],
  ['Prove it', 'Project Review · Proof · Security · Browser checks · Independent review'],
  ['Ship it safely', 'Ship · CI · Observability · Rollback · Handoff'],
];
const INFLUENCES = ['Google Engineering Practices', 'Matt Pocock / AI Hero', 'ICM', 'Alibaba OpenCodeReview', 'Gauntlet Loop', 'Humanizer', 'Unlazy', 'Impeccable'];

function Mark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="mark-svg">
      <path d="M9 11h10l13 34 13-34h10L36 54h-8L9 11Z" fill="currentColor" />
      <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".28" />
    </svg>
  );
}

function getYouTubeId(url) {
  if (!url) return '';
  const embed = url.match(/youtube\.com\/embed\/([A-Za-z0-9_-]+)/);
  if (embed?.[1]) return embed[1];
  const watch = url.match(/[?&]v=([A-Za-z0-9_-]+)/);
  if (watch?.[1]) return watch[1];
  const short = url.match(/youtu\.be\/([A-Za-z0-9_-]+)/);
  return short?.[1] || '';
}

function SoundControl() {
  const trackUrl = (import.meta.env.VITE_VIBE_SOUNDTRACK_URL || '').trim();
  const youtubeId = getYouTubeId(trackUrl);
  const audioRef = useRef(null);
  const synthRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => () => {
    if (synthRef.current?.context) synthRef.current.context.close();
  }, []);

  const startPulse = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return false;
    const context = new AudioContext();
    const master = context.createGain();
    const filter = context.createBiquadFilter();
    const low = context.createOscillator();
    const high = context.createOscillator();
    low.type = 'sine';
    low.frequency.value = 110;
    high.type = 'triangle';
    high.frequency.value = 164.81;
    filter.type = 'lowpass';
    filter.frequency.value = 520;
    master.gain.value = 0.0001;
    low.connect(filter);
    high.connect(filter);
    filter.connect(master);
    master.connect(context.destination);
    low.start();
    high.start();
    master.gain.exponentialRampToValueAtTime(0.018, context.currentTime + 0.8);
    synthRef.current = { context, master };
    return true;
  };

  const stopPulse = () => {
    const synth = synthRef.current;
    if (!synth) return;
    synth.master.gain.cancelScheduledValues(synth.context.currentTime);
    synth.master.gain.setValueAtTime(Math.max(synth.master.gain.value, 0.0001), synth.context.currentTime);
    synth.master.gain.exponentialRampToValueAtTime(0.0001, synth.context.currentTime + 0.2);
    window.setTimeout(() => synth.context.close(), 240);
    synthRef.current = null;
  };

  const toggle = async () => {
    if (playing) {
      if (!youtubeId && trackUrl && audioRef.current) audioRef.current.pause();
      else if (!youtubeId) stopPulse();
      setPlaying(false);
      return;
    }
    if (youtubeId) {
      setPlaying(true);
      return;
    }
    if (trackUrl && audioRef.current) {
      audioRef.current.volume = 0.36;
      try {
        await audioRef.current.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
      return;
    }
    if (startPulse()) setPlaying(true);
  };

  const youtubeSrc = youtubeId ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}&controls=0&rel=0` : '';

  return (
    <div className="sound-wrap">
      {youtubeId && playing ? <iframe title="Vibe Engineering soundtrack" src={youtubeSrc} allow="autoplay" aria-hidden="true" tabIndex="-1" className="sound-frame" /> : null}
      {!youtubeId && trackUrl ? <audio ref={audioRef} src={trackUrl} loop preload="none" /> : null}
      <button className="sound-control" type="button" onClick={toggle} aria-pressed={playing}>
        <span className="sound-dot" aria-hidden="true" />
        <span>{playing ? 'Sound on' : 'Sound off'}</span>
      </button>
    </div>
  );
}

function Principle({ number, title, children }) {
  return <article className="principle reveal"><span className="principle-number">{number}</span><h3>{title}</h3><p>{children}</p></article>;
}

function App() {
  const page = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('.hero-intro > *', { y: 28, opacity: 0, duration: 0.85, stagger: 0.07, ease: 'power3.out' });
      gsap.utils.toArray('.reveal').forEach((element) => gsap.from(element, { y: 26, opacity: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 88%' } }));
      gsap.to('.studio-reel-track', { xPercent: -32, ease: 'none', scrollTrigger: { trigger: '.studio-reel', start: 'top bottom', end: 'bottom top', scrub: 1 } });
      gsap.to('.studio-orbit-word', { rotate: 14, scale: 1.08, ease: 'none', scrollTrigger: { trigger: '.studio-orbit', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    }, page);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={page} id="main-content">
      <a className="skip-link" href="#studio">Skip to content</a>

      <section className="hero studio-hero" id="top">
        <div className="studio-grid" aria-hidden="true" />
        <nav className="nav" aria-label="Primary navigation">
          <a className="brand" href="#top" aria-label="Vibe Engineering home"><Mark /><span>Vibe Engineering</span></a>
          <div className="nav-actions"><a href="#studio">Studio</a><a href="#system">System</a><a href="https://github.com/executiveusa/vibe-engineering" target="_blank" rel="noreferrer">Open source</a></div>
        </nav>
        <div className="hero-layout studio-hero-layout">
          <div className="hero-intro">
            <p className="eyebrow">THE PAULI EFFECT / AI-NATIVE PRODUCT STUDIO</p>
            <h1>We build with AI.<br /><em>We don’t ship AI slop.</em></h1>
            <p className="hero-copy">Vibe Engineering is the operating system our studio uses to turn ideas into finished websites, agents, apps, brands, and business systems—without handing taste, proof, or ownership over to the model.</p>
            <div className="hero-actions"><a className="text-link strong" href="#studio">See the studio <span aria-hidden="true">↘</span></a><a className="text-link" href="#system">See the system <span aria-hidden="true">↘</span></a></div>
          </div>
          <aside className="hero-note"><span>01 / THE STUDIO RULE</span><p>AI should reason. The system should enforce. The human keeps the final call.</p></aside>
        </div>
        <div className="hero-index" aria-hidden="true"><span>32 CORE SKILLS</span><span>OPEN SOURCE OPERATING SYSTEM</span><span>STUDIO TESTED / OWNER CONTROLLED</span></div>
      </section>

      <section className="studio-reel section" id="studio" aria-labelledby="studio-title">
        <div className="section-shell split-heading reveal studio-reel-heading">
          <p className="section-label">Studio reel</p>
          <div><h2 id="studio-title">Different outputs.<br />Same operating system.</h2><p className="lead-copy">Websites. Agents. Apps. Brands. Community platforms. Internal systems. The work changes. The way we think, build, review, and prove it does not.</p></div>
        </div>
        <div className="studio-reel-viewport" aria-label="Selected studio work">
          <div className="studio-reel-track">{[...STUDIO_REEL, ...STUDIO_REEL].map(([name, type], index) => <article className="reel-card" key={`${name}-${index}`}><span>{String((index % STUDIO_REEL.length) + 1).padStart(2, '0')}</span><strong>{name}</strong><em>{type}</em></article>)}</div>
        </div>
      </section>

      <section className="studio-orbit section paper-section" aria-labelledby="orbit-title">
        <div className="studio-orbit-word" aria-hidden="true">VIBE</div>
        <div className="section-shell orbit-copy reveal"><p className="section-label">The system behind the work</p><h2 id="orbit-title">32 skills.<br />One studio workflow.</h2><p>Not 32 buttons to memorize. One system that knows when to ask, when to research, when to build, when to challenge, and when to stop.</p></div>
      </section>

      <section className="system-groups section ink-section" id="system" aria-labelledby="system-title">
        <div className="section-shell split-heading reveal"><p className="section-label">In normal language</p><div><h2 id="system-title">What the system actually does for you.</h2><p className="lead-copy muted">The technical names stay in the backend. The person using Vibe only needs to understand the job in front of them.</p></div></div>
        <div className="section-shell skill-groups">{HUMAN_GROUPS.map(([title, items], index) => <article className="skill-group reveal" key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{items}</p></article>)}</div>
      </section>

      <section className="review-engine section review-section" aria-labelledby="review-title">
        <div className="section-shell review-layout reveal"><div><p className="section-label">Independent review</p><h2 id="review-title">We don’t let the AI grade its own homework.</h2></div><div className="review-copy"><p>Serious work gets a separate review pass. Vibe now includes a dedicated <strong>Project Review</strong> skill backed by our fork of Alibaba OpenCodeReview, plus Vibe checks for system impact, security, taste, slop, proof, ownership, and rollback.</p><div className="review-chain" aria-label="Review chain"><span>BUILD</span><b>→</b><span>PROJECT REVIEW</span><b>→</b><span>STOP SLOP</span><b>→</b><span>TASTE</span><b>→</b><span>PROOF</span><b>→</b><span>SHIP</span></div></div></div>
      </section>

      <section className="influences section paper-section" aria-labelledby="influences-title">
        <div className="section-shell split-heading reveal"><p className="section-label">Open ideas in</p><div><h2 id="influences-title">We studied how strong builders work. Then we organized it into our own system.</h2><p className="lead-copy">We keep attribution visible, adapt what is useful, and put every borrowed pattern under Vibe’s own rules for ownership, proof, independent review, and release authority.</p></div></div>
        <div className="section-shell influence-grid">{INFLUENCES.map((item, index) => <div className="influence-item reveal" key={item}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong></div>)}</div>
      </section>

      <section className="method section ink-section" aria-labelledby="method-title">
        <div className="section-shell split-heading reveal"><p className="section-label">The workflow</p><div><h2 id="method-title">Say what you mean. Decide what good means. Prove you got there.</h2><p className="lead-copy muted">That simple loop sits underneath the whole studio—from a first idea to the exact production revision that ships.</p></div></div>
        <div className="flow section-shell reveal">{FLOW.map((step, index) => <div className="flow-step" key={step}><span>{String(index + 1).padStart(2, '0')}</span><strong>{step}</strong></div>)}</div>
        <div className="method-note section-shell reveal"><span>INTENT → STANDARD → EVIDENCE</span><p>Three questions are enough to start:</p><div className="contract-line"><strong>What do we want?</strong><i /><strong>What does good look like?</strong><i /><strong>What proves it?</strong></div></div>
      </section>

      <section className="three-products section oxide-section" aria-labelledby="products-title"><div className="section-shell split-heading reveal"><p className="section-label">One brand / three doors</p><div><h2 id="products-title">The Studio.<br />The System.<br />The School.</h2><p className="lead-copy">We build products for clients. We open-source the operating system. And we teach the next generation how to use AI without giving up judgment.</p></div></div></section>

      <section className="closing section closing-studio" aria-labelledby="closing-title"><div className="section-shell closing-layout reveal"><p className="section-label">Client zero</p><h2 id="closing-title">This site was built with it.</h2><div className="closing-copy"><p>So is the system behind it. Vibe Engineering exposes the same skills through the repo, CLI, API, and MCP so humans and agents can use one operating system.</p><a className="closing-link" href="https://github.com/executiveusa/vibe-engineering" target="_blank" rel="noreferrer">Open the system <span aria-hidden="true">↗</span></a></div></div></section>

      <footer><div className="section-shell footer-inner"><span>Vibe Engineering / The Pauli Effect</span><SoundControl /><span>Verify It Before Everything.</span></div></footer>
    </main>
  );
}

export default App;
