// A deterministic AgentProvider for VIBE_MODEL_LANE=dry. Plain object satisfying
// @ai-hero/sandcastle's exported AgentProvider interface (structural typing;
// verified against dist/AgentProvider.d.ts in 0.6.4). No model, no keys, no
// network.
//
// The sandbox only contains the target repo: .vibe-factory copies made on the
// runner never reach it (first CI run failed exactly that way: "Cannot find
// module '/home/agent/workspace/.vibe-factory/dry-agent-run.mjs'"). So the two
// dry sources are read from this directory on the runner at load time and
// materialized inside the sandbox by the command itself, base64-encoded so the
// command string stays shell-safe. The stage travels in the provider's env,
// which the AgentProvider contract injects at launch.
import { readFileSync } from 'node:fs';

const B64 = (name) => readFileSync(new URL(`./${name}`, import.meta.url)).toString('base64');
const RUN_SRC_B64 = B64('dry-agent-run.mjs');
const RECEIPT_SRC_B64 = B64('dry-receipt.mjs');

export function dryAgent(stage) {
  return {
    name: `dry-${stage}`,
    env: { VIBE_DRY_STAGE: stage },
    captureSessions: false,
    buildPrintCommand({ prompt }) {
      // Prompt goes to stdin so nothing depends on argv limits or shell quoting.
      return {
        command:
          `mkdir -p .vibe-factory-dry && ` +
          `echo '${RUN_SRC_B64}' | base64 -d > .vibe-factory-dry/dry-agent-run.mjs && ` +
          `echo '${RECEIPT_SRC_B64}' | base64 -d > .vibe-factory-dry/dry-receipt.mjs && ` +
          `node .vibe-factory-dry/dry-agent-run.mjs`,
        stdin: prompt,
      };
    },
    parseStreamLine(line) {
      return line.trim() ? [{ type: 'text', text: line }] : [];
    },
  };
}
