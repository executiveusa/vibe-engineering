// A deterministic AgentProvider for VIBE_MODEL_LANE=dry. Plain object satisfying
// @ai-hero/sandcastle's exported AgentProvider interface (structural typing;
// verified against dist/AgentProvider.d.ts in 0.6.4). No model, no keys, no
// network: buildPrintCommand runs the in-sandbox dry script for the stage named
// in this provider's injected env.
export function dryAgent(stage) {
  return {
    name: `dry-${stage}`,
    env: { VIBE_DRY_STAGE: stage },
    captureSessions: false,
    buildPrintCommand({ prompt }) {
      // Prompt goes to stdin so nothing depends on argv limits or shell quoting.
      return { command: 'node .vibe-factory/dry-agent-run.mjs', stdin: prompt };
    },
    parseStreamLine(line) {
      return line.trim() ? [{ type: 'text', text: line }] : [];
    },
  };
}
