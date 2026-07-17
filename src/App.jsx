import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { comparison, council, faqs, offers, stages, system } from './content';
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

function Arrow() {
  return <span aria-hidden="true">↗</span>;
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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      gsap.from('.hero-kicker, .hero-title, .hero-copy, .hero-actions, .hero-proof', {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
      });

      gsap.to('.hero-orb.one', {
        yPercent: 22,
        xPercent: -10,
        scrollTrigger: { trigger: '.hero', scrub: 1.1, start: 'top top', end: 'bottom top' },
      });
      gsap.to('.hero-orb.two', {
        yPercent: -18,
        xPercent: 10,
        scrollTrigger: { trigger: '.hero', scrub: 1.3, start: 'top top', end: 'bottom top' },
      });
      gsap.to('.hero-grid', {
        scale: 1.12,
        opacity: 0.1,
        scrollTrigger: { trigger: '.hero', scrub: 1, start: 'top top', end: 'bottom top' },
      });

      gsap.utils.toArray('.reveal').forEach((element) => {
        gsap.from(element, {
          y: 46,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 86%' },
        });
      });

      gsap.utils.toArray('.stage-row').forEach((row, index) => {
        gsap.from(row, {
          x: index % 2 === 0 ? -28 : 28,
          opacity: 0,
          duration: 0.7,
          scrollTrigger: { trigger: row, start: 'top 90%' },
        });
      });

      gsap.to('.manifesto-line', {
        backgroundPositionX: '0%',
        stagger: 0.22,
        ease: 'none',
        scrollTrigger: {
          trigger: '.manifesto',
          start: 'top 72%',
          end: 'bottom 45%',
          scrub: 1,
        },
      });
    }, page);

    return () => ctx.revert();
  }, []);

  const copyCommand = async () => {
    await navigator.clipboard.writeText('npm install && npm run check && npm run dev');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main ref={page} id="main-content">
      <a className="skip-link" href="#content">Skip to content</a>
      <nav className="nav shell" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Vibe Engineering home">
          <Mark compact />
          <span>Vibe Engineering</span>
        </a>
        <div className="nav-links">
          <a href="#method">Method</a>
          <a href="#council">Council</a>
          <a href="#score">Score</a>
          <a href="#ownership">Ownership</a>
        </div>
        <a className="nav-cta" href="#prompt">Get the prompt</a>
      </nav>

      <div id="content">
        <section className="hero" id="top">
          <div className="hero-grid" />
          <div className="hero-orb one" />
          <div className="hero-orb two" />
          <div className="shell hero-inner">
            <p className="eyebrow hero-kicker">A sovereign AI building method</p>
            <h1 className="hero-title">Stop vibe coding.<br /><span>Start vibe engineering.</span></h1>
            <p className="hero-copy">The speed of AI. The discipline of engineering. The freedom of ownership. No technical degree required.</p>
            <div className="hero-actions">
              <a href="#prompt" className="button primary">Get the free system prompt</a>
              <a href="#score" className="button secondary">Test the release gate</a>
            </div>
            <div className="hero-proof">
              <span className="proof-rule" />
              <strong>V.I.B.E.</strong>
              <span>Verify It Before Everything.</span>
            </div>
          </div>
        </section>

        <section className="manifesto section shell">
          <p className="eyebrow reveal">The line we will not cross</p>
          <div className="manifesto-copy">
            <p className="manifesto-line">Power without principles breeds chaos.</p>
            <p className="manifesto-line">Freedom without ownership is just another dependency.</p>
          </div>
        </section>

        <section className="section shell shift" aria-labelledby="shift-heading">
          <div className="section-heading reveal">
            <p className="eyebrow">The shift</p>
            <h2 id="shift-heading">Generation is cheap.<br />Judgment is the product.</h2>
          </div>
          <div className="comparison reveal">
            <div className="comparison-head"><span>Vibe coding</span><span>Vibe engineering</span></div>
            {comparison.map(([before, after]) => (
              <div className="comparison-row" key={before}>
                <span>{before}</span><span>{after}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="method section shell" id="method">
          <div className="section-heading reveal">
            <p className="eyebrow">The eight-stage flow</p>
            <h2>Simple enough to teach.<br />Strict enough to trust.</h2>
          </div>
          <div className="stage-list">
            {stages.map(({ number, title, text }) => (
              <article className="stage-row" key={number}>
                <span className="stage-number">{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="system section" id="system">
          <div className="shell">
            <div className="section-heading reveal">
              <p className="eyebrow">The operating system</p>
              <h2>Five tools.<br />One quality line.</h2>
            </div>
            <div className="system-grid">
              {system.map(({ title, text }, index) => (
                <article className="system-card reveal" key={title}>
                  <span className="mono-label">0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="council section shell" id="council">
          <div className="section-heading reveal">
            <p className="eyebrow">The Vibe Council</p>
            <h2>Agreement is not proof.<br />Useful disagreement is.</h2>
            <p className="section-lead">Each reviewer has a different job. No single agent is allowed to design, approve, and excuse the same decision.</p>
          </div>
          <div className="council-grid">
            {council.map(({ role, call, text }, index) => (
              <article className="council-card reveal" key={role}>
                <span className="mono-label">COUNCIL / 0{index + 1}</span>
                <p className="council-call">{call}</p>
                <h3>{role}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="score section" id="score">
          <div className="shell">
            <div className="score-intro reveal">
              <p className="eyebrow">The visible standard</p>
              <h2>No “looks good to me.”<br />The work earns release.</h2>
              <p>Move the controls. The Judge does not ship work below 8.5, and it never lets visual polish hide weak security, reliability, or ownership.</p>
            </div>
            <div className="reveal"><ScoreLab /></div>
          </div>
        </section>

        <section className="ownership section" id="ownership">
          <div className="shell ownership-inner">
            <div className="ownership-mark reveal"><Mark /></div>
            <p className="eyebrow reveal">The sovereignty pledge</p>
            <h2 className="reveal">Once you buy it,<br />it is yours.</h2>
            <p className="ownership-copy reveal">Your code. Your data. Your accounts. Your workflows. Your future. We charge for human time and compute—not permanent dependence.</p>
            <div className="pledges reveal">
              <span>No hostage data</span>
              <span>No mystery systems</span>
              <span>No forced subscription</span>
              <span>No ownership games</span>
            </div>
          </div>
        </section>

        <section className="offers section shell" aria-labelledby="offers-heading">
          <div className="section-heading reveal">
            <p className="eyebrow">Freedom has an entry point</p>
            <h2 id="offers-heading">Learn it. Install it. Own it.</h2>
          </div>
          <div className="offer-grid">
            {offers.map(({ eyebrow, title, text, cta, href }) => (
              <article className="offer-card reveal" key={title}>
                <p className="eyebrow">{eyebrow}</p>
                <h3>{title}</h3>
                <p>{text}</p>
                <a href={href} download={href.endsWith('.md') || undefined}>{cta} <Arrow /></a>
              </article>
            ))}
          </div>
        </section>

        <section className="prompt section shell" id="prompt">
          <div className="prompt-card reveal">
            <div>
              <p className="eyebrow">Free foundation</p>
              <h2>Train your AI to act like a Vibe Engineer.</h2>
              <p>The complete foundation prompt includes specification, verification, Council review, Vibe Score judging, rollback thinking, and ownership checks.</p>
            </div>
            <div className="prompt-actions">
              <a className="button primary light" href="/vibe-engineering-foundation-prompt.md" download>Download prompt</a>
              <button className="command" type="button" onClick={copyCommand}>
                <span className="mono-label">LOCAL START</span>
                <code>{copied ? 'Copied.' : 'npm install && npm run check && npm run dev'}</code>
              </button>
            </div>
          </div>
        </section>

        <section className="faq section shell">
          <div className="section-heading reveal">
            <p className="eyebrow">Plain answers</p>
            <h2>Questions before trust.</h2>
          </div>
          <div className="faq-list reveal">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="references section shell">
          <div className="section-heading reveal">
            <p className="eyebrow">Built in the open</p>
            <h2>Original method.<br />Clear intellectual roots.</h2>
          </div>
          <div className="reference-grid reveal">
            <p>Vibe Engineering is an original Pauli Effect / Yappyverse methodology informed by established software engineering, test-driven development, evaluation systems, adversarial review, human-centered design, and AI-sovereignty principles.</p>
            <p>Direct references include Andrej Karpathy’s <a href="https://github.com/karpathy/llm-council" target="_blank" rel="noreferrer">LLM Council</a> and <a href="https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f" target="_blank" rel="noreferrer">LLM Wiki</a> patterns. They are credited as influences—not presented as our original work.</p>
          </div>
        </section>
      </div>

      <footer className="footer shell">
        <a className="brand" href="#top"><Mark compact /><span>Vibe Engineering</span></a>
        <p>Verify it before everything.</p>
        <p>© 2026 The Pauli Effect / Yappyverse</p>
      </footer>
    </main>
  );
}

export default App;
