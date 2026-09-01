import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FLOW = ['Choose / See', 'Shape / Make', 'Prove / Challenge', 'Decide / Release / Learn'];

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

  const youtubeSrc = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}&controls=0&rel=0`
    : '';

  return (
    <div className="sound-wrap">
      {youtubeId && playing ? (
        <iframe
          title="Vibe Engineering soundtrack"
          src={youtubeSrc}
          allow="autoplay"
          aria-hidden="true"
          tabIndex="-1"
          className="sound-frame"
        />
      ) : null}
      {!youtubeId && trackUrl ? <audio ref={audioRef} src={trackUrl} loop preload="none" /> : null}
      <button className="sound-control" type="button" onClick={toggle} aria-pressed={playing}>
        <span className="sound-dot" aria-hidden="true" />
        <span>{playing ? 'Sound on' : 'Sound off'}</span>
      </button>
    </div>
  );
}

function SignalField() {
  return (
    <div className="signal-field" aria-hidden="true">
      <div className="signal-stamp">V</div>
      <div className="signal-rule signal-rule-a" />
      <div className="signal-rule signal-rule-b" />
      <div className="signal-caption">IDEA / TASTE / PROOF</div>
    </div>
  );
}

function Principle({ number, title, children }) {
  return (
    <article className="principle reveal">
      <span className="principle-number">{number}</span>
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  );
}

function App() {
  const page = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = gsap.context(() => {
      gsap.from('.hero-intro > *', {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.07,
        ease: 'power3.out',
      });

      gsap.from('.signal-stamp', {
        xPercent: 8,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
      });

      gsap.utils.toArray('.reveal').forEach((element) => {
        gsap.from(element, {
          y: 22,
          opacity: 0,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 90%' },
        });
      });
    }, page);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={page} id="main-content">
      <a className="skip-link" href="#why">Skip to content</a>

      <section className="hero" id="top">
        <SignalField />

        <nav className="nav" aria-label="Primary navigation">
          <a className="brand" href="#top" aria-label="Vibe Engineering home">
            <Mark />
            <span>Vibe Engineering</span>
          </a>
          <div className="nav-actions">
            <a href="#method">How it works</a>
            <a href="https://github.com/executiveusa/vibe-engineering" target="_blank" rel="noreferrer">Open source</a>
          </div>
        </nav>

        <div className="hero-layout">
          <div className="hero-intro">
            <p className="eyebrow">V.I.B.E. / Verify It Before Everything</p>
            <h1>AI builds fast.<br /><em>Slop does too.</em></h1>
            <p className="hero-copy">
              Vibe Engineering is an open-source set of skills that helps you turn an idea into something clear, useful, well designed, and actually proven to work.
            </p>
            <div className="hero-actions">
              <a className="text-link strong" href="#method">See how it works <span aria-hidden="true">↘</span></a>
              <a className="text-link" href="https://github.com/executiveusa/vibe-engineering" target="_blank" rel="noreferrer">Use the open-source repo <span aria-hidden="true">↗</span></a>
            </div>
          </div>

          <aside className="hero-note" aria-label="Vibe Engineering in one sentence">
            <span>01 / THE POINT</span>
            <p>You do not need to know code. You need a way to tell the AI what you mean, what good looks like, and how to prove it.</p>
          </aside>
        </div>

        <div className="hero-index" aria-hidden="true">
          <span>OPEN SOURCE</span>
          <span>BUILT FOR HUMANS + AGENTS</span>
          <span>STOP SLOP BUILT IN</span>
        </div>
      </section>

      <section className="why section paper-section" id="why" aria-labelledby="why-title">
        <div className="section-shell split-heading reveal">
          <p className="section-label">Why care</p>
          <div>
            <h2 id="why-title">AI can give you an answer before you have finished the question.</h2>
            <p className="lead-copy">
              That is the opportunity and the problem. Vibe Engineering gives you a few simple habits that keep speed from turning into bad decisions.
            </p>
          </div>
        </div>

        <div className="principles section-shell">
          <Principle number="01" title="Get clear first">Before the AI starts building, make sure it understands what you actually want.</Principle>
          <Principle number="02" title="Keep your taste">Do not let the model's average answer become your brand, product, or voice.</Principle>
          <Principle number="03" title="Catch the slop">Use built-in checks for robotic copy, lazy design, half-finished wiring, missing states, and fake done claims.</Principle>
          <Principle number="04" title="Make it prove it">Tests, screenshots, live checks, source history, and rollback beat “trust me, it works.”</Principle>
        </div>
      </section>

      <section className="method section ink-section" id="method" aria-labelledby="method-title">
        <div className="section-shell split-heading reveal">
          <p className="section-label">How it works</p>
          <div>
            <h2 id="method-title">Use one skill for the problem in front of you.</h2>
            <p className="lead-copy muted">Grill the idea. Write the spec. Build a slice. Stop the slop. Prove it. Ship the exact version that passed.</p>
          </div>
        </div>

        <div className="flow section-shell reveal" aria-label="Vibe Engineering full nine-step rhythm grouped into four public movements">
          {FLOW.map((step, index) => (
            <div className="flow-step" key={step}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>

        <div className="method-note section-shell reveal">
          <span>THREE QUESTIONS</span>
          <p>For anything important, answer these before calling it done:</p>
          <div className="contract-line">
            <strong>What do we want?</strong><i />
            <strong>What does good look like?</strong><i />
            <strong>What proves it?</strong>
          </div>
        </div>
      </section>

      <section className="closing section oxide-section" aria-labelledby="closing-title">
        <div className="section-shell closing-layout reveal">
          <p className="section-label">Open source</p>
          <h2 id="closing-title">Use the rules.<br />Keep the keys.</h2>
          <div className="closing-copy">
            <p>The skills, design rules, proof steps, CLI, API, and MCP interface live in the repo. Use them with your own agents and change what you need.</p>
            <a className="closing-link" href="#method">Learn the flow <span aria-hidden="true">↘</span></a>
            {' '}
            <a className="closing-link" href="https://github.com/executiveusa/vibe-engineering" target="_blank" rel="noreferrer">Open the repo <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>

      <footer>
        <div className="section-shell footer-inner">
          <span>Vibe Engineering / The Pauli Effect</span>
          <SoundControl />
          <span>Verify It Before Everything.</span>
        </div>
      </footer>
    </main>
  );
}

export default App;
