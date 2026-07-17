import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './styles.css';

gsap.registerPlugin(ScrollTrigger);

const stages = [
  ['01', 'Vision', 'Name the outcome before touching the tools.'],
  ['02', 'Blueprint', 'Turn the idea into a small, testable plan.'],
  ['03', 'Build', 'Let AI execute inside clear boundaries.'],
  ['04', 'Verify', 'Check assumptions, behavior, security, and quality.'],
  ['05', 'Council', 'Use multiple perspectives to challenge the work.'],
  ['06', 'Judge', 'Score the result against one visible standard.'],
  ['07', 'Ship', 'Release only what is understandable and owned.'],
  ['08', 'Improve', 'Learn from reality and strengthen the system.'],
];

const system = [
  ['Vibe Spec', 'Turns plain language into a build contract.'],
  ['Vibe Flow', 'Moves the project through fixed quality gates.'],
  ['Vibe Council', 'Challenges architecture, usability, safety, and taste.'],
  ['Vibe Judge', 'Decides whether the work is ready to ship.'],
  ['Vibe Score', 'Makes quality visible instead of subjective.'],
];

const score = [
  ['Clarity', 'Can a non-technical owner explain it?'],
  ['Reliability', 'Does it behave correctly under pressure?'],
  ['Security', 'Are data, access, and failure modes controlled?'],
  ['Maintainability', 'Can another builder safely continue the work?'],
  ['Taste', 'Does every detail feel intentional?'],
  ['Ownership', 'Can the customer leave with everything?'],
];

function Mark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="mark-svg">
      <path d="M8 11h11l13 34L45 11h11L36 54h-8L8 11Z" fill="currentColor" />
      <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".32" />
    </svg>
  );
}

function App() {
  const page = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-kicker, .hero-title, .hero-copy, .hero-actions, .hero-proof', {
        y: 28,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
      });

      gsap.to('.hero-orb.one', {
        yPercent: 24,
        xPercent: -12,
        scrollTrigger: { trigger: '.hero', scrub: 1.1, start: 'top top', end: 'bottom top' },
      });
      gsap.to('.hero-orb.two', {
        yPercent: -18,
        xPercent: 10,
        scrollTrigger: { trigger: '.hero', scrub: 1.3, start: 'top top', end: 'bottom top' },
      });
      gsap.to('.hero-grid', {
        scale: 1.12,
        opacity: 0.12,
        scrollTrigger: { trigger: '.hero', scrub: 1, start: 'top top', end: 'bottom top' },
      });

      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.from(el, {
          y: 44,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 84%' },
        });
      });

      gsap.utils.toArray('.stage-row').forEach((row, i) => {
        gsap.from(row, {
          x: i % 2 === 0 ? -30 : 30,
          opacity: 0,
          duration: 0.75,
          scrollTrigger: { trigger: row, start: 'top 88%' },
        });
      });

      gsap.to('.manifesto-line', {
        backgroundPositionX: '0%',
        stagger: 0.25,
        ease: 'none',
        scrollTrigger: {
          trigger: '.manifesto',
          start: 'top 72%',
          end: 'bottom 45%',
          scrub: 1,
        },
      });
    }, page);

    const cards = [...document.querySelectorAll('.tilt-card')];
    const listeners = cards.map((card) => {
      const onMove = (event) => {
        const r = card.getBoundingClientRect();
        const x = (event.clientX - r.left) / r.width - 0.5;
        const y = (event.clientY - r.top) / r.height - 0.5;
        gsap.to(card, { rotateY: x * 6, rotateX: y * -6, transformPerspective: 900, duration: 0.35 });
      };
      const onLeave = () => gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.55, ease: 'power3.out' });
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      return [card, onMove, onLeave];
    });

    return () => {
      listeners.forEach(([card, onMove, onLeave]) => {
        card.removeEventListener('mousemove', onMove);
        card.removeEventListener('mouseleave', onLeave);
      });
      ctx.revert();
    };
  }, []);

  return (
    <main ref={page}>
      <nav className="nav shell">
        <a className="brand" href="#top" aria-label="Vibe Engineering home">
          <Mark />
          <span>Vibe Engineering</span>
        </a>
        <div className="nav-links">
          <a href="#method">Method</a>
          <a href="#system">System</a>
          <a href="#ownership">Ownership</a>
        </div>
        <a className="nav-cta" href="#prompt">Get the prompt</a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-grid" />
        <div className="hero-orb one" />
        <div className="hero-orb two" />
        <div className="shell hero-inner">
          <p className="eyebrow hero-kicker">A sovereign AI building method</p>
          <h1 className="hero-title">Stop vibe coding.<br /><span>Start vibe engineering.</span></h1>
          <p className="hero-copy">
            Build with AI without surrendering judgment, quality, or ownership. No technical degree required.
          </p>
          <div className="hero-actions">
            <a href="#prompt" className="button primary">Get the free system prompt</a>
            <a href="#method" className="button secondary">See how it works</a>
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

      <section className="section split shell" id="method">
        <div className="section-intro reveal">
          <p className="eyebrow">The shift</p>
          <h2>AI can move fast.<br />Your standards move first.</h2>
        </div>
        <div className="body-copy reveal">
          <p>Vibe coding asks AI to make something.</p>
          <p><strong>Vibe engineering creates the rules that decide whether the result deserves to exist.</strong></p>
          <p>You learn the few principles that matter. The system handles the repetition.</p>
        </div>
      </section>

      <section className="method section shell">
        <div className="section-heading reveal">
          <p className="eyebrow">The eight-stage flow</p>
          <h2>Simple enough to follow.<br />Strong enough to trust.</h2>
        </div>
        <div className="stage-list">
          {stages.map(([number, title, text]) => (
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
            <p className="eyebrow">The Vibe system</p>
            <h2>Five tools. One quality line.</h2>
          </div>
          <div className="system-grid">
            {system.map(([title, text], i) => (
              <article className="system-card tilt-card reveal" key={title}>
                <span>0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="score section shell">
        <div className="score-copy reveal">
          <p className="eyebrow">The visible standard</p>
          <h2>No “looks good to me.”<br />The work earns its score.</h2>
          <p>Every project is judged using the same six questions. Weakness becomes visible before customers pay for it.</p>
        </div>
        <div className="score-panel reveal">
          <div className="score-top">
            <span>Vibe Score</span>
            <strong>8.5+</strong>
          </div>
          {score.map(([label, text]) => (
            <div className="score-row" key={label}>
              <span>{label}</span>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="ownership section" id="ownership">
        <div className="shell ownership-inner">
          <div className="ownership-mark reveal"><Mark /></div>
          <p className="eyebrow reveal">The sovereignty pledge</p>
          <h2 className="reveal">Once you buy it,<br />it is yours.</h2>
          <p className="ownership-copy reveal">
            Your code. Your data. Your accounts. Your workflows. Your future. We charge for human time and compute—not permanent dependence.
          </p>
          <div className="pledges reveal">
            <span>No hostage data</span>
            <span>No mystery systems</span>
            <span>No forced subscription</span>
            <span>No ownership games</span>
          </div>
        </div>
      </section>

      <section className="prompt section shell" id="prompt">
        <div className="prompt-card reveal">
          <div>
            <p className="eyebrow">Free foundation</p>
            <h2>Turn your AI into a Vibe Engineer.</h2>
            <p>One system prompt. Built-in planning, quality gates, verification, council review, judging, and ownership checks.</p>
          </div>
          <a className="button primary light" href="/vibe-engineering-foundation-prompt.md" download>Download foundation prompt</a>
        </div>
      </section>

      <section className="references section shell">
        <div className="section-heading reveal">
          <p className="eyebrow">Built in the open</p>
          <h2>Original method.<br />Clear intellectual roots.</h2>
        </div>
        <div className="reference-grid reveal">
          <p>Vibe Engineering is an original Pauli Effect / Yappyverse methodology inspired by established software engineering, test-driven development, evaluation systems, multi-agent review, human-centered design, and AI-sovereignty principles.</p>
          <p>Direct references include Andrej Karpathy’s <a href="https://github.com/karpathy/llm-council" target="_blank" rel="noreferrer">LLM Council</a> and <a href="https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f" target="_blank" rel="noreferrer">LLM Wiki</a> patterns. They are cited as influences—not presented as our original work.</p>
        </div>
      </section>

      <footer className="footer shell">
        <a className="brand" href="#top"><Mark /><span>Vibe Engineering</span></a>
        <p>Verify it before everything.</p>
        <p>© 2026 The Pauli Effect / Yappyverse</p>
      </footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
