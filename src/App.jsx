import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { council, faqs, journey, qualityLayers, stages } from './content';
import { calculateVibeScore, RELEASE_FLOOR, SCORE_DIMENSIONS } from './vibe-score.mjs';

gsap.registerPlugin(ScrollTrigger);

const initialScores = {
  clarity: 8.8,
  reliability: 8.6,
  security: 8.4,
  maintainability: 8.5,
  taste: 9.1,
  ownership: 9.4,
};

function Mark({ compact = false }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={compact ? 'mark-svg compact' : 'mark-svg'}>
      <path d="M8 11h11l13 34L45 11h11L36 54h-8L8 11Z" fill="currentColor" />
      <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".32" />
    </svg>
  );
}

function SoundControl() {
  const trackUrl = (import.meta.env.VITE_VIBE_SOUNDTRACK_URL || '').trim();
  const youtubeMatch = trackUrl.match(/youtube\.com\/embed\/([A-Za-z0-9_-]+)/);
  const youtubeId = youtubeMatch?.[1] || '';
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
    const drift = context.createOscillator();
    const driftGain = context.createGain();

    low.type = 'sine';
    low.frequency.value = 110;
    high.type = 'sine';
    high.frequency.value = 164.81;
    drift.type = 'sine';
    drift.frequency.value = 0.11;
    driftGain.gain.value = 0.008;
    filter.type = 'lowpass';
    filter.frequency.value = 540;
    filter.Q.value = 0.8;
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
    master.gain.exponentialRampToValueAtTime(0.032, context.currentTime + 0.9);

    synthRef.current = { context, master };
    return true;
  };

  const stopPulse = async () => {
    const synth = synthRef.current;
    if (!synth) return;
    synth.master.gain.cancelScheduledValues(synth.context.currentTime);
    synth.master.gain.setValueAtTime(Math.max(synth.master.gain.value, 0.0001), synth.context.currentTime);
    synth.master.gain.exponentialRampToValueAtTime(0.0001, synth.context.currentTime + 0.3);
    window.setTimeout(() => synth.context.close(), 360);
    synthRef.current = null;
  };

  const toggle = async () => {
    if (playing) {
      if (!youtubeId && trackUrl && audioRef.current) audioRef.current.pause();
      else if (!youtubeId) await stopPulse();
      setPlaying(false);
      return;
    }

    if (youtubeId) {
      setPlaying(true);
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
          style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
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

function StoryMap({ activeIndex }) {
  const nodeY = (index) => 48 + index * 51;
  return (
    <svg className="story-map" viewBox="0 0 320 410" role="img" aria-labelledby="story-map-title story-map-desc">
      <title id="story-map-title">Vibe Engineering thinking path</title>
      <desc id="story-map-desc">A connected path from access to judgment, verification, systems thinking, truth, proof, and ownership.</desc>
      <line x1="64" y1="48" x2="64" y2={nodeY(journey.length - 1)} className="story-map-line" />
      {journey.map((item, index) => {
        const active = index === activeIndex;
        const passed = index < activeIndex;
        return (
          <g key={item.number} className={`story-node ${active ? 'active' : ''} ${passed ? 'passed' : ''}`}>
            <circle cx="64" cy={nodeY(index)} r={active ? 12 : 8} />
            <text x="92" y={nodeY(index) - 4} className="story-node-number">{item.number}</text>
            <text x="92" y={nodeY(index) + 15} className="story-node-label">{item.signal}</text>
          </g>
        );
      })}
    </svg>
  );
}

function ScoreLab() {
  const [scores, setScores] = useState(initialScores);
  const result = useMemo(() => calculateVibeScore(scores), [scores]);

  const update = (key, value) => setScores((current) => ({ ...current, [key]: Number(value) }));
  const reason = result.status === 'SHIP'
    ? 'Release floor cleared. No hard-stop dimension is below 7.'
    : result.hardStops.length
      ? `Hard stop: ${result.hardStops.join(', ')} must reach 7 or higher.`
      : `${result.weakest} is the weakest dimension. Raise the total to ${RELEASE_FLOOR}.`;

  return (
    <div className="score-lab-grid">
      <div className="score-controls" aria-label="Interactive Vibe Score controls">
        {SCORE_DIMENSIONS.map(({ key, label, question }) => (
          <label className="score-control" key={key}>
            <span className="score-label"><strong>{label}</strong><output>{scores[key].toFixed(1)}</output></span>
            <span className="score-question">{question}</span>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={scores[key]}
              onChange={(event) => update(key, event.target.value)}
              aria-label={`${label} score`}
            />
          </label>
        ))}
      </div>
      <aside className={`judge-panel ${result.status.toLowerCase()}`} aria-live="polite">
        <span className="mono-label">VIBE JUDGE / RELEASE DECISION</span>
        <div className="judge-score">
          <strong>{result.score.toFixed(1)}</strong>
          <span>/ 10</span>
        </div>
        <div className="judge-status">{result.status}</div>
        <p>{reason}</p>
        <div className="judge-rule"><span>Release floor</span><strong>{RELEASE_FLOOR}+</strong></div>
        <div className="judge-rule"><span>Hard stops</span><strong>Security · Reliability · Ownership</strong></div>
      </aside>
    </div>
  );
}

function App() {
  const page = useRef(null);
  const [activeScene, setActiveScene] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const chapters = Array.from(document.querySelectorAll('[data-story-chapter]'));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveScene(Number(visible.target.dataset.storyChapter));
      },
      { threshold: [0.35, 0.55, 0.75], rootMargin: '-18% 0px -30% 0px' },
    );

    chapters.forEach((chapter) => observer.observe(chapter));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      gsap.from('.hero-meta, .hero-title, .hero-copy, .hero-actions, .vibe-lockup', {
        y: 28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.09,
        ease: 'power3.out',
      });

      gsap.utils.toArray('.section-reveal').forEach((element) => {
        gsap.from(element, {
          y: 34,
          opacity: 0,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%' },
        });
      });

      gsap.utils.toArray('.method-step').forEach((row, index) => {
        gsap.from(row, {
          x: index % 2 === 0 ? -18 : 18,
          opacity: 0,
          duration: 0.55,
          scrollTrigger: { trigger: row, start: 'top 91%' },
        });
      });
    }, page);

    return () => ctx.revert();
  }, []);

  const copyCommand = async () => {
    await navigator.clipboard.writeText('npm install && npm run check && npm run dev');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const progress = ((activeScene + 1) / journey.length) * 100;

  return (
    <main ref={page} id="main-content">
      <a className="skip-link" href="#content">Skip to content</a>

      <nav className="nav shell" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Vibe Engineering home">
          <Mark compact />
          <span>Vibe Engineering</span>
        </a>
        <div className="nav-links">
          <a href="#story">Story</a>
          <a href="#method">Method</a>
          <a href="#score">Proof</a>
          <a href="#ownership">Own it</a>
        </div>
        <SoundControl />
      </nav>

      <div id="content">
        <section className="hero" id="top">
          <div className="hero-field" aria-hidden="true">
            <span className="field-line line-a" />
            <span className="field-line line-b" />
            <span className="field-line line-c" />
          </div>
          <div className="shell hero-inner">
            <p className="hero-meta">Built by The Pauli Effect · 2026 <span>Part of the Pauli Suite</span></p>
            <h1 className="hero-title">Think before<br />you build.</h1>
            <p className="hero-copy">Vibe Engineering is a way to take an idea, question it, test it, and turn it into something real. AI is part of the process. The bigger skill is learning how to make better decisions.</p>
            <div className="hero-actions">
              <a href="#story" className="button primary">Start the story</a>
              <a href="#method" className="button text-button">See the method</a>
            </div>
            <div className="vibe-lockup" aria-label="V.I.B.E. means Verify It Before Everything">
              <strong>V.I.B.E.</strong>
              <span>Verify It Before Everything.</span>
            </div>
          </div>
        </section>

        <section className="story" id="story" aria-labelledby="story-heading">
          <div className="shell story-intro section-reveal">
            <p className="eyebrow">The idea</p>
            <h2 id="story-heading">AI opened the door.<br />Your thinking decides what comes through it.</h2>
          </div>

          <div className="shell story-layout">
            <aside className="story-rail" aria-label="Story progress">
              <div className="story-rail-head">
                <span>{String(activeScene + 1).padStart(2, '0')}</span>
                <span>{String(journey.length).padStart(2, '0')}</span>
              </div>
              <div className="story-progress" aria-hidden="true"><span style={{ height: `${progress}%` }} /></div>
              <StoryMap activeIndex={activeScene} />
            </aside>

            <div className="story-chapters">
              {journey.map((item, index) => (
                <article className="story-chapter" key={item.number} data-story-chapter={index}>
                  <div>
                    <p className="chapter-kicker"><span>{item.number}</span>{item.kicker}</p>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                    <span className="chapter-signal">{item.signal}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="core section shell" aria-labelledby="core-heading">
          <div className="section-heading section-reveal">
            <p className="eyebrow">The simple rule underneath everything</p>
            <h2 id="core-heading">Intent. Standard. Evidence.</h2>
            <p className="section-lead">Know what you are trying to do. Know what good looks like. Know what would prove you got there.</p>
          </div>
          <div className="core-grid section-reveal">
            <article><span>01</span><h3>Intent</h3><p>What are we trying to change, for who, and why?</p></article>
            <article><span>02</span><h3>Standard</h3><p>What does good look like before we start convincing ourselves?</p></article>
            <article><span>03</span><h3>Evidence</h3><p>What can we point to that makes the claim real?</p></article>
          </div>
        </section>

        <section className="method section" id="method">
          <div className="shell">
            <div className="section-heading section-reveal">
              <p className="eyebrow">The Vibe flow</p>
              <h2>Easy to remember.<br />Hard to fake.</h2>
              <p className="section-lead">The public words stay simple. Underneath them, the ICM workspace keeps the contracts, proof, ownership, and handoffs organized for people and agents.</p>
            </div>
            <div className="method-list">
              {stages.map(({ number, action, title, text }) => (
                <article className="method-step" key={number}>
                  <span className="method-number">{number}</span>
                  <div className="method-action"><strong>{action}</strong><span>{title}</span></div>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="quality section shell" aria-labelledby="quality-heading">
          <div className="section-heading section-reveal">
            <p className="eyebrow">No slop</p>
            <h2 id="quality-heading">Default is not a decision.</h2>
            <p className="section-lead">Vibe Engineering checks the idea, the experience, the build, and the business before generic AI habits become the product.</p>
          </div>
          <div className="quality-list section-reveal">
            {qualityLayers.map(({ title, question, text }, index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <strong>{question}</strong>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="council section" id="council">
          <div className="shell">
            <div className="section-heading section-reveal">
              <p className="eyebrow">Fresh eyes</p>
              <h2>Builders build.<br />Reviewers challenge.</h2>
              <p className="section-lead">The person or agent that made the work does not get to be the only voice deciding whether it is ready.</p>
            </div>
            <div className="council-list section-reveal">
              {council.map(({ role, call, text }, index) => (
                <article key={role}>
                  <span>0{index + 1}</span>
                  <div><h3>{role}</h3><strong>{call}</strong></div>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="score section" id="score">
          <div className="shell">
            <div className="score-intro section-reveal">
              <p className="eyebrow">Proof before release</p>
              <h2>No “looks good to me.”<br />The work earns release.</h2>
              <p>Move the controls. The Judge holds the line when confidence and reality disagree.</p>
            </div>
            <div className="section-reveal"><ScoreLab /></div>
          </div>
        </section>

        <section className="client-zero section shell" aria-labelledby="client-zero-heading">
          <div className="client-zero-grid section-reveal">
            <div>
              <p className="eyebrow">Client Zero</p>
              <h2 id="client-zero-heading">We use the system on ourselves first.</h2>
            </div>
            <div>
              <p>This site is part of the proof. Its story, design, code, ICM structure, review, rights checks, deployment, and rollback all go through the same Vibe process.</p>
              <a href="https://github.com/executiveusa/vibe-engineering" target="_blank" rel="noreferrer">Inspect the repo ↗</a>
            </div>
          </div>
        </section>

        <section className="ownership section" id="ownership">
          <div className="shell ownership-inner">
            <div className="ownership-mark section-reveal"><Mark /></div>
            <p className="eyebrow section-reveal">The ownership rule</p>
            <h2 className="section-reveal">Build your own.<br />Keep your own.</h2>
            <p className="ownership-copy section-reveal">Your code, data, accounts, access, documentation, and decisions should still make sense when the original builder is gone. Retention should come from value, not captivity.</p>
            <div className="pledges section-reveal">
              <span>Understand it</span>
              <span>Move it</span>
              <span>Change it</span>
              <span>Own it</span>
            </div>
          </div>
        </section>

        <section className="prompt section shell" id="prompt">
          <div className="prompt-card section-reveal">
            <div>
              <p className="eyebrow">Build with the method</p>
              <h2>One process. Any capable agent.</h2>
              <p>The rules live in the repo, not inside one personality. Humans, Codex, Claude, Gemini, Hermes, CI, and future tools can read the same contracts.</p>
            </div>
            <button className="command" type="button" onClick={copyCommand}>
              <span className="mono-label">LOCAL START</span>
              <code>{copied ? 'Copied.' : 'npm install && npm run check && npm run dev'}</code>
            </button>
          </div>
        </section>

        <section className="faq section shell">
          <div className="section-heading section-reveal">
            <p className="eyebrow">Keep it clear</p>
            <h2>Four questions.</h2>
          </div>
          <div className="faq-list section-reveal">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="references section shell">
          <div className="reference-grid section-reveal">
            <div>
              <p className="eyebrow">Built in the open</p>
              <h2>Our method.<br />Clear roots.</h2>
            </div>
            <div>
              <p>Vibe Engineering combines our own working rules with ideas we have tested from open-source engineering, design, review, context, and AI research. We keep a source and provenance ledger so influence never turns into invisible copying.</p>
              <a href="https://github.com/executiveusa/vibe-engineering/blob/main/docs/governance/SOURCE-PROVENANCE-LEDGER.md" target="_blank" rel="noreferrer">See the source ledger ↗</a>
            </div>
          </div>
        </section>
      </div>

      <footer className="footer shell">
        <a className="brand" href="#top"><Mark compact /><span>Vibe Engineering</span></a>
        <p>V.I.B.E. · Verify It Before Everything.</p>
        <p>Built by The Pauli Effect · 2026 · Part of the Pauli Suite</p>
      </footer>
    </main>
  );
}

export default App;
