import React, { useMemo, useState } from 'react';
import { listSkillSources, listWorkflows, routeWorkflow } from './workflows/skill-router.mjs';
import './workflow-navigator.css';

const BASE = 'https://github.com/executiveusa/vibe-engineering/blob/main/';
const STAGES = ['INTENT', 'SPEC', 'PLAN', 'BUILD', 'PROOF', 'COUNCIL', 'JUDGE', 'SHIP', 'OPERATE'];
const MODELS = ['Codex GPT', 'Claude Sonnet', 'Gemini', 'DeepSeek', 'Kimi', 'Qwen'];

export default function WorkflowNavigator() {
  const [request, setRequest] = useState('Audit the mobile checkout user journey before launch');
  const [icmStage, setStage] = useState('PROOF');
  const [workflowId, setWorkflowId] = useState('');
  const [builderModel, setBuilderModel] = useState('Codex GPT');
  const [reviewerModel, setReviewerModel] = useState('');
  const [showSources, setShowSources] = useState(false);
  const [copied, setCopied] = useState('');
  const workflows = useMemo(() => listWorkflows(), []);
  const packet = useMemo(() => routeWorkflow({
    request, icmStage, workflowId: workflowId || null, builderModel, reviewerModel,
  }), [request, icmStage, workflowId, builderModel, reviewerModel]);
  const sources = useMemo(() => listSkillSources(packet.workflow.id), [packet.workflow.id]);
  const handoff = [
    'Use Vibe Engineering. Respect the pinned House Skill, ICM stage gates, rights and owner authority.',
    'Task: ' + request,
    'Current stage: ' + icmStage,
    'Read in order: ' + packet.readOrder.join(' -> '),
    'Workflow: ' + packet.workflow.title,
    'Load only the current procedure:',
    ...packet.steps.map((step) => step.order + '. ' + step.name + ' | ' + step.source + ' | ' + step.tool),
    'Code review: use the existing automatic OpenCodeReview gate on the exact candidate; record its receipt.',
    'Independent reviewer: ' + (reviewerModel || 'ask the user to choose a model from a different model family') + '. Builder: ' + builderModel + '.',
    'Delegate review using an authorized agent adapter. An instruction packet is not evidence of execution.',
    'Council challenges proof; Judge returns HOLD or SHIP after independent review and the required human approval.',
  ].join('\n');

  async function copyHandoff() {
    if (!navigator.clipboard?.writeText) return setCopied('Clipboard not available here.');
    try { await navigator.clipboard.writeText(handoff); setCopied('Agent handoff copied.'); }
    catch { setCopied('Clipboard permission denied.'); }
  }

  return <section className="skill-desk" id="skill-desk" aria-labelledby="skill-desk-title">
    <div className="skill-desk-inner">
      <div className="skill-desk-heading">
        <p>06 / SKILL DISPATCH DESK</p>
        <h2 id="skill-desk-title">One job. One route.<br /><em>The right skills.</em></h2>
        <p>Start with the outcome and current ICM stage. We select one workflow, show step-by-step tools, and prepare independent review. Only the current step's skill needs to be loaded.</p>
      </div>
      <div className="skill-desk-columns">
        <div className="skill-desk-controls">
          <label htmlFor="skill-task">Describe the work</label>
          <textarea id="skill-task" rows={3} maxLength={4000} value={request} onChange={(event) => setRequest(event.target.value)} />
          <div className="skill-desk-fields">
            <div><label htmlFor="skill-stage">ICM stage</label><select id="skill-stage" value={icmStage} onChange={(event) => setStage(event.target.value)}>{STAGES.map((stage) => <option key={stage}>{stage}</option>)}</select></div>
            <div><label htmlFor="skill-route">Workflow</label><select id="skill-route" value={workflowId} onChange={(event) => { setWorkflowId(event.target.value); setShowSources(false); }}><option value="">Auto-select</option>{workflows.map((workflow) => <option key={workflow.id} value={workflow.id}>{workflow.title}</option>)}</select></div>
            <div><label htmlFor="skill-builder">Builder model</label><select id="skill-builder" value={builderModel} onChange={(event) => setBuilderModel(event.target.value)}>{MODELS.map((model) => <option key={model}>{model}</option>)}</select></div>
            <div><label htmlFor="skill-reviewer">Separate reviewer</label><select id="skill-reviewer" value={reviewerModel} onChange={(event) => setReviewerModel(event.target.value)}><option value="">Ask me to choose</option>{MODELS.map((model) => <option key={model}>{model}</option>)}</select></div>
          </div>
          <button type="button" onClick={copyHandoff}>Copy agent handoff</button>
          <p className="skill-desk-status" role="status" aria-live="polite">{copied || 'Portable to Hermes, Codex, Claude or another agent.'}</p>
        </div>
        <div className="skill-desk-result">
          <p className="skill-desk-kicker">MATCH / {packet.workflow.id}</p>
          <h3>{packet.workflow.title}</h3>
          <p>Read AGENTS.md → ICMR.yaml → CONTEXT.md → House Skill → selected workflow.</p>
          <ol>
            {packet.steps.map((step) => <li key={step.order}>
              <span>{String(step.order).padStart(2, '0')}</span>
              <div><strong>{step.name}</strong><small>Tool: {step.tool}</small><a href={BASE + step.source} target="_blank" rel="noreferrer">Open {step.skill} only for this step</a></div>
            </li>)}
          </ol>
          <button type="button" className="skill-desk-toggle" aria-expanded={showSources} onClick={() => setShowSources(!showSources)}>{showSources ? 'Hide' : 'Explore'} specialist sources ({sources.length})</button>
          {showSources ? <ul className="skill-desk-sources">{sources.map((source) => <li key={source.id}><a href={source.url} rel="noreferrer" target="_blank">{source.title}</a><span>{source.status}</span></li>)}</ul> : null}
        </div>
      </div>
      <div className="skill-desk-review">
        <article><small>01 / CODE REVIEW</small><strong>OpenCodeReview</strong><p>{packet.review.codeReview.required ? 'Required in the automatic ICM review gate; not executed on this page.' : 'Required if this workflow modifies code.'}</p></article>
        <article><small>02 / INDEPENDENT AGENT</small><strong>{packet.review.independent.state === 'READY_FOR_DISPATCH' ? 'Reviewer selected' : 'Choose a separate model'}</strong><p>{packet.review.independent.state === 'READY_FOR_DISPATCH' ? reviewerModel + ' is eligible for dispatch via an authorized agent runtime.' : 'Reviewer must be a different model family from the builder.'}</p></article>
        <article><small>03 / JUDGE</small><strong>HOLD until proof</strong><p>Routing creates instructions, not execution or approval receipts. Human authority and rollback remain mandatory.</p></article>
      </div>
    </div>
  </section>;
}
