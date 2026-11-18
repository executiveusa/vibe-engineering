// Test helper: replaces global fetch with a canned JSON response before the
// selector script runs. Payload comes from STUB_FETCH_JSON.
const payload = JSON.parse(process.env.STUB_FETCH_JSON || '{"projects":[],"pagination":{}}');
globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => payload });

// Make date-dependent nightly batch selection deterministic in this test-only
// fetch shim. The production selector still rotates using the real clock.
if (process.env.STUB_FETCH_JSON) {
  Date.now = () => 0;
}
