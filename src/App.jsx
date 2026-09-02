import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './studio.css';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  ['01', 'Tell it what you want.', 'Start with the outcome. Vibe helps the AI stop guessing.'],
  ['02', 'Decide what good means.', 'Set the standard before the first answer becomes the default.'],
  ['03', 'Make it.', 'Let the AI do the heavy lifting inside clear boundaries.'],
  ['04', 'Check it.', 'Run the right review, test, taste, and system checks for the work.'],
  ['05', 'Prove it before you ship it.', 'Show the evidence. Keep the final call with the human.'],
];

const ENTRY_POINTS = [
  ['FILES + FOLDERS', 'Any agent', 'Open the repo. Your agent reads the rules and current context. No extra orchestrator required.'],
  ['PLUGIN', 'Claude Code + skill-compatible agents', 'Use Vibe as an open-source skill pack inside the tools you already use.'],
  ['CLI', 'Terminal', 'Call the same Vibe skills from your shell when you want a direct workflow.'],
  ['API + MCP', 'Remote agents and apps', 'Connect other agents to the same skills, maps, and verification rules.'],
];

function Mark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="mark-svg">
      <path d="M9 11h10l13 34 13-34h10L36 54h-8L9 11Z" fill="currentColor" />
      <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".28" />
    </svg>
  );
}

function App() {
  const page = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('.hero-intro > *', { y: 26, opacity: 0, duration: 0.8, stagger: 0.06, ease: 'power3.out' });
      gsap.utils.toArray('.reveal').forEach((element) => {
        gsap.from(element, {
          y: 24,
          opacity: 0,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%' },
        });
      });
    }, page);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={page} id="main-content">
      <a className="skip-link" href="#how">Skip to content</a>

      <section className="hero studio-hero" id="top">
        <div className="studio-grid" aria-hidden="true" />
        <nav className="nav" aria-label="Primary navigation">
          <a className="brand" href="#top" aria-label="Vibe Engineering home"><Mark /><span>Vibe Engineering</span></a>
          <div className="nav-actions">
            <a href="#how">How it works</a>
            <a href="#use">Use it</a>
            <a href="https://github.com/executiveusa/vibe-engineering" target="_blank" rel="noreferrer">GitHub ↗</a>
          </div>
        </nav>

        <div className="hero-layout studio-hero-layout">
          <div className="hero-intro">
            <p className="eyebrow">FREE / OPEN SOURCE / WORKS WITH YOUR AGENT</p>
            <h1>Verify It Before<br /><em>Everything.</em></h1>
            <p className="hero-copy">Bring the idea. Vibe helps your AI get clear, make it, check it, and prove it works—before you ship.</p>
            <div className="hero-actions">
              <a className="primary-cta" href="https://github.com/executiveusa/vibe-engineering" target="_blank" rel="noreferrer">Get Vibe free <span aria-hidden="true">↗</span></a>
              <a className="text-link" href="#how">See the five steps <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <aside className="hero-note">
            <span>WORKS WITH THE TOOLS YOU ALREADY USE</span>
            <p>Claude Code. Codex. Cursor. OpenCode. Your own agent. The rules live in files, not in agent soup.</p>
          </aside>
        </div>

        <div className="hero-index" aria-hidden="true">
          <span>MIT LICENSED</span>
          <span>FILES / PLUGIN / CLI / API / MCP</span>
          <span>HUMAN KEEPS THE FINAL CALL</span>
        </div>
      </section>

      <section className="section paper-section how-section" id="how" aria-labelledby="how-title">
        <div className="section-shell split-heading reveal compact-heading">
          <p className="section-label">The whole idea</p>
          <div>
            <h2 id="how-title">Five steps.<br />The hard parts stay underneath.</h2>
            <p className="lead-copy">You do not need to become a software engineer to build something serious with AI. Vibe keeps the process simple while the checks stay strict.</p>
          </div>
        </div>
        <div className="section-shell five-steps">
          {STEPS.map(([number, title, copy]) => (
            <article className="simple-step reveal" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section ink-section research-section" aria-labelledby="research-title">
        <div className="section-shell research-layout reveal">
          <p className="section-label">We did the research</p>
          <div>
            <h2 id="research-title">You should not have to collect a hundred developer rules from the internet.</h2>
            <p className="lead-copy muted">We did the homework: experienced engineers, designers, open-source communities, review systems, and real production failures. We kept the parts that survived our checks, recorded the sources, and put them behind one simple workflow.</p>
            <a className="text-link strong" href="https://github.com/executiveusa/vibe-engineering/blob/main/docs/governance/SOURCE-PROVENANCE-LEDGER.md" target="_blank" rel="noreferrer">See what we studied <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>

      <section className="section use-section" id="use" aria-labelledby="use-title">
        <div className="section-shell split-heading reveal compact-heading">
          <p className="section-label">Use it your way</p>
          <div>
            <h2 id="use-title">One set of rules.<br />Any agent.</h2>
            <p className="lead-copy">Vibe is not another swarm of agents. The rules live in normal files and folders. Every way into Vibe points back to the same source.</p>
          </div>
        </div>
        <div className="section-shell entry-grid">
          {ENTRY_POINTS.map(([label, title, copy]) => (
            <article className="entry-point reveal" key={label}>
              <span>{label}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
        <div className="section-shell quick-start reveal">
          <div>
            <span className="section-label">Start here</span>
            <p>Give your agent the repo and one instruction:</p>
          </div>
          <code>Read AGENTS.md. Follow Vibe. Verify It Before Everything.</code>
          <a className="primary-cta dark-cta" href="https://github.com/executiveusa/vibe-engineering" target="_blank" rel="noreferrer">Open the repo <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section className="section oxide-section studio-proof" aria-labelledby="proof-title">
        <div className="section-shell proof-layout reveal">
          <p className="section-label">Why we give it away</p>
          <div>
            <h2 id="proof-title">Use our process before you ever hire our studio.</h2>
            <p className="lead-copy">The open-source system is the proof. Use it on your own work. Inspect the rules. Call the skills. Keep your code. If it makes you better, you already understand what Vibe Engineering is for.</p>
          </div>
        </div>
      </section>

      <section className="section closing closing-studio" aria-labelledby="closing-title">
        <div className="section-shell closing-layout reveal">
          <p className="section-label">V.I.B.E.</p>
          <h2 id="closing-title">Make the AI<br />prove it.</h2>
          <div className="closing-copy">
            <p>Free. Open source. MIT licensed. Built to work with the agents you already use.</p>
            <div className="closing-actions">
              <a className="primary-cta light-cta" href="https://github.com/executiveusa/vibe-engineering" target="_blank" rel="noreferrer">Get Vibe free <span aria-hidden="true">↗</span></a>
              <a className="text-link" href="/api/v1/skills">See the live skills API <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="section-shell footer-inner">
          <span>Vibe Engineering / The Pauli Effect</span>
          <span>Verify It Before Everything.</span>
        </div>
      </footer>
    </main>
  );
}

export default App;
