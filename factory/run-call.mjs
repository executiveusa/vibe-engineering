// One sanctioned local operator call with durable result persistence.
// The result text is written BEFORE anything else can throw, and the write is
// verified. Usage: node factory/run-call.mjs <stage> <maxOutputTokens> <outFile> < prompt.txt
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { chat } from './openrouter-client.mjs';

export async function runCall({ stage, maxOutputTokens, outFile, prompt, chatImpl = chat }) {
  const r = await chatImpl({ stage, maxOutputTokens, messages: [{ role: 'user', content: prompt }] });
  writeFileSync(outFile, r.text);                      // persist first
  if (statSync(outFile).size !== r.text.length) throw new Error('result write incomplete');
  return { id: r.id, actual_usd: r.actual_usd, reserved_usd: r.reserved_usd, cost_source: r.cost_source, outFile };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [stage, maxOut, outFile] = process.argv.slice(2);
  const prompt = readFileSync(0, 'utf8');
  if (!stage || !maxOut || !outFile || !prompt.trim()) { console.error('usage: run-call.mjs <stage> <maxOutputTokens> <outFile> < prompt'); process.exit(2); }
  const receipt = await runCall({ stage, maxOutputTokens: Number(maxOut), outFile, prompt });
  console.log(JSON.stringify(receipt));
}
