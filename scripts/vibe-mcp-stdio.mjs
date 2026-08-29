import readline from 'node:readline';
import { getRuntime } from '../src/truth/runtime.mjs';
import { handleMcpRpc } from '../src/mcp/core.mjs';

const { api } = await getRuntime();
const input = readline.createInterface({ input: process.stdin, crlfDelay: Infinity, terminal: false });

for await (const line of input) {
  if (!line.trim()) continue;
  let request;
  try {
    request = JSON.parse(line);
  } catch {
    process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } })}\n`);
    continue;
  }

  const response = await handleMcpRpc(api, request);
  process.stdout.write(`${JSON.stringify(response)}\n`);
}
