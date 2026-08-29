import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FILM_SCENES = [
  {
    id: 'apps',
    label: 'Apps',
    line: 'Turn a rough idea into something people can use.',
  },
  {
    id: 'automations',
    label: 'Automations',
    line: 'Turn repeat work into a system that keeps moving.',
  },
  {
    id: 'agents',
    label: 'AI agents',
    line: 'Give AI a job, boundaries, and a way to check itself.',
  },
  {
    id: 'systems',
    label: 'Systems',
    line: 'Connect the pieces so the whole thing can be trusted.',
  },
];

function Mark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="mark-svg">
      <path d="M8 11h11l13 34L45 11h11L36 54h-8L8 11Z" fill="currentColor" />
      <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".34" />
    </svg>
  );
}

function SoundControl() {
  const trackUrl = (import.meta.env.VITE_VIBE_SOUNDTRACK_URL || '').trim();
  const audioRef = useRef(null);
  const synthRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => () => {
    if (synthRef.current?.context) synthRef.current.context.close();
  }, []);

  const startPulse = async () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return false;

    const context = new AudioContext();
    const master = context.createGain();
    const filter = context.createBiquadFilter();
    const low = context.createOscillator();
    const high = context.createOscillator();
    const drift = context.createOscillator();
    const driftGain = context.createGain();

    low.type = 'sine';
    low.frequency.value = 110;
    high.type = 'triangle';
    high.frequency.value = 164.81;
    drift.type = 'sine';
    drift.frequency.value = 0.09;
    driftGain.gain.value = 0.006;
    filter.type = 'lowpass';
    filter.frequency.value = 560;
    filter.Q.value = 0.7;
    master.gain.value = 0.0001;

    drift.connect(driftGain);
    driftGain.connect(master.gain);
    low.connect(filter);
    high.connect(filter);
    filter.connect(master);
    master.connect(context.destination);

    low.start();
    high.start();
    drift.start();
    master.gain.exponentialRampToValueAtTime(0.026, context.currentTime + 0.8);

    synthRef.current = { context, master };
    return true;
  };

  const stopPulse = async () => {
    const synth = synthRef.current;
    if (!synth) return;
    synth.master.gain.cancelScheduledValues(synth.context.currentTime);
    synth.master.gain.setValueAtTime(Math.max(synth.master.gain.value, 0.0001), synth.context.currentTime);
    synth.master.gain.exponentialRampToValueAtTime(0.0001, synth.context.currentTime + 0.25);
    window.setTimeout(() => synth.context.close(), 300);
    synthRef.current = null;
  };

  const toggle = async () => {
    if (playing) {
      if (trackUrl && audioRef.current) audioRef.current.pause();
      else await stopPulse();
      setPlaying(false);
      return;
    }

    if (trackUrl && audioRef.current) {
      audioRef.current.volume = 0.42;
      try {
        await audioRef.current.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
      return;
    }

    if (await startPulse()) setPlaying(true);
  };

  return (
    <div className="sound-wrap">
      {trackUrl ? <audio ref={audioRef} src={trackUrl} loop preload="none" /> : null}
      <button className="sound-control" type="button" onClick={toggle} aria-pressed={playing}>
        <span className="sound-bars" aria-hidden="true"><i /><i /><i /></span>
        <span>{playing ? 'Sound on' : 'Sound off'}</span>
      </button>
    </div>
  );
}

function AppScene() {
  return (
    <div className="scene-object app-scene-object">
      <div className="app-browser">
        <div className="browser-chrome"><span /><span /><span /></div>
        <div className="browser-body">
          <div className="browser-nav" />
          <div className="browser-title" />
          <div className="browser-copy" />
          <div className="browser-grid"><span /><span /><span /></div>
          <div className="browser-action">LIVE</div>
        </div>
      </div>
      <div className="phone-frame">
        <div className="phone-notch" />
        <div className="phone-line wide" />
        <div className="phone-line" />
        <div className="phone-card" />
        <div className="phone-button" />
      </div>
    </div>
  );
}

function AutomationScene() {
  return (
    <div className="scene-object flow-scene-object">
      <svg className="flow-lines" viewBox="0 0 700 520" aria-hidden="true">
        <path d="M105 260H260" />
        <path d="M350 260H520" />
        <path d="M305 215V115H505" />
        <path d="M305 305V405H505" />
      </svg>
      <div className="flow-node n1"><strong>Idea</strong><span>plain language</span></div>
      <div className="flow-node n2"><strong>AI</strong><span>make</span></div>
      <div className="flow-node n3"><strong>Check</strong><span>verify</span></div>
      <div className="flow-node n4"><strong>Ship</strong><span>release</span></div>
      <div className="flow-node n5"><strong>Learn</strong><span>improve</span></div>
    </div>
  );
}

function AgentScene() {
  return (
    <div className="scene-object agent-scene-object">
      <div className="agent-core">AI</div>
      <div className="agent-ring ring-one" />
      <div className="agent-ring ring-two" />
      <span className="agent-task task-a">research</span>
      <span className="agent-task task-b">design</span>
      <span className="agent-task task-c">build</span>
      <span className="agent-task task-d">check</span>
      <div className="agent-proof"><span>OWNER</span><strong>YOU</strong></div>
    </div>
  );
}

function SystemScene() {
  return (
    <div className="scene-object system-scene-object">
      {['INPUT', 'DECISION', 'OUTPUT', 'CHECK'].map((label, index) => (
        <div className="system-stage" key={label} style={{ '--stage': index }}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <strong>{label}</strong>
          <i />
        </div>
      ))}
    </div>
  );
}

function SceneVisual({ id }) {
  if (id === 'apps') return <AppScene />;
  if (id === 'automations') return <AutomationScene />;
  if (id === 'agents') return <AgentScene />;
  return <SystemScene />;
}

function BuildFilm() {
  const [active, setActive] = useState(0);
  const heroVideoUrl = (import.meta.env.VITE_VIBE_HERO_VIDEO_URL || '').trim();

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) return undefined;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % FILM_SCENES.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="build-film" aria-hidden="true">
      <div className="film-grain" />
      <div className="film-grid" />
      {FILM_SCENES.map((scene, index) => (
        <div className={`film-scene ${active === index ? 'active' : ''}`} key={scene.id}>
          <div className="film-word">{scene.label}</div>
          <SceneVisual id={scene.id} />
        </div>
      ))}
      {heroVideoUrl ? (
        <video className="hero-video" src={heroVideoUrl} autoPlay muted loop playsInline preload="metadata" />
      ) : null}
      <div className="film-vignette" />
      <div className="film-status">
        <span>{String(active + 1).padStart(2, '0')} / 04</span>
        <strong>{FILM_SCENES[active].label}</strong>
        <p>{FILM_SCENES[active].line}</p>
      </div>
    </div>
  );
}

function MethodRow({ number, title, children }) {
  return (
    <article className="method-row reveal">
      <span className="method-number">{number}</span>
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  );
}

function App() {
  const page = useRef(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      gsap.from('.hero-copy-block > *', {
        y: 32,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power4.out',
      });

      gsap.utils.toArray('.reveal').forEach((element) => {
        gsap.from(element, {
          y: 28,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%' },
        });
      });
    }, page);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={page} id="main-content">
      <a className="skip-link" href="#why">Skip to content</a>

      <section className="hero" id="top">
        <BuildFilm />

        <nav className="nav" aria-label="Primary navigation">
          <a className="brand" href="#top" aria-label="Vibe Engineering home">
            <Mark />
            <span>Vibe Engineering</span>
          </a>
          <div className="nav-actions">
            <a href="#method">The process</a>
            <a href="#why">Why it matters</a>
            <SoundControl />
          </div>
        </nav>

        <div className="hero-copy-block">
          <p className="hero-kicker">V.I.B.E.</p>
          <h1>Verify it<br />before<br />everything.</h1>
          <p className="hero-copy">You do not need to become a developer. You need a process for turning your ideas, taste, and judgment into systems that work.</p>
          <div className="hero-actions">
            <a className="button primary" href="#method">See the process</a>
            <a className="button secondary" href="#why">Why not vibe coding?</a>
          </div>
        </div>

        <div className="hero-foot">
          <span>Stop vibe coding.</span>
          <strong>Start Vibe Engineering.</strong>
        </div>
      </section>

      <section className="why section" id="why" aria-labelledby="why-title">
        <div className="section-shell">
          <div className="why-lead reveal">
            <p>AI made the first draft cheap.</p>
            <h2 id="why-title">The hard part is deciding what is worth shipping.</h2>
          </div>

          <div className="contrast-grid reveal">
            <div className="contrast-side muted-side">
              <h3>Vibe coding</h3>
              <p>Prompt it. Hope it works. Patch what breaks. Keep going.</p>
            </div>
            <div className="contrast-side signal-side">
              <h3>Vibe Engineering</h3>
              <p>Set the intent. Use your taste. Prove the important parts. Keep ownership.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="method section" id="method" aria-labelledby="method-title">
        <div className="section-shell">
          <div className="section-heading reveal">
            <p>The process</p>
            <h2 id="method-title">Systems thinking without the engineer costume.</h2>
            <span>You bring the point of view. AI gives you reach. The process keeps the work honest.</span>
          </div>

          <div className="method-list">
            <MethodRow number="01" title="Idea">Say what you want in plain language. Start with the change you want to make.</MethodRow>
            <MethodRow number="02" title="Shape">Use your taste to steer the result. Decide what good should feel like before AI decides for you.</MethodRow>
            <MethodRow number="03" title="Prove">Check what must be true. A working demo is not the same thing as a trustworthy system.</MethodRow>
            <MethodRow number="04" title="Own">Keep the code, data, decisions, and ability to change direction later.</MethodRow>
          </div>
        </div>
      </section>

      <section className="systems section" aria-labelledby="systems-title">
        <div className="section-shell systems-shell">
          <div className="systems-copy reveal">
            <p>Systems thinking, plain English</p>
            <h2 id="systems-title">Know what goes in. Know what should happen. Know what comes out. Know how you will check it.</h2>
          </div>
          <div className="system-line reveal" aria-label="Input, decision, output, check">
            <span>Input</span><i />
            <span>Decision</span><i />
            <span>Output</span><i />
            <span>Check</span>
          </div>
        </div>
      </section>

      <section className="closing section" aria-labelledby="closing-title">
        <div className="section-shell closing-shell reveal">
          <p>Bring the idea. Bring your taste.</p>
          <h2 id="closing-title">Let AI do more of the making without giving up judgment.</h2>
          <a className="button paper" href="https://github.com/executiveusa/vibe-engineering" target="_blank" rel="noreferrer">See the open system</a>
        </div>
      </section>

      <footer>
        <div className="section-shell footer-inner">
          <span>Vibe Engineering · The Pauli Effect</span>
          <span>Verify It Before Everything.</span>
        </div>
      </footer>
    </main>
  );
}

export default App;
