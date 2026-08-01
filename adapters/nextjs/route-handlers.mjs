import { getRuntime } from '../../src/truth/runtime.mjs';
import { createWebHandlers } from '../../src/truth/web-adapter.mjs';

const handlers = createWebHandlers(getRuntime);

export const getManifest = handlers.manifest;
export const getTruth = handlers.truth;
export const getWorkflow = handlers.workflow;
export const resolveContext = handlers.resolve;

// Next.js App Router usage:
// app/api/v1/manifest/route.mjs
//   export { getManifest as GET } from '<root>/adapters/nextjs/route-handlers.mjs';
// app/api/v1/truth/[id]/route.mjs
//   export { getTruth as GET } from '<root>/adapters/nextjs/route-handlers.mjs';
// app/api/v1/workflows/[id]/route.mjs
//   export { getWorkflow as GET } from '<root>/adapters/nextjs/route-handlers.mjs';
// app/api/v1/resolve-context/route.mjs
//   export { resolveContext as POST } from '<root>/adapters/nextjs/route-handlers.mjs';
