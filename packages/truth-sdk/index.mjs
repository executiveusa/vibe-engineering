export class VibeTruthClient {
  constructor({ baseUrl, fetchImpl = globalThis.fetch } = {}) {
    if (!baseUrl) throw new Error('baseUrl is required');
    if (!fetchImpl) throw new Error('fetch implementation is required');
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.fetch = fetchImpl;
  }

  async request(path, options = {}) {
    const response = await this.fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: { 'content-type': 'application/json', ...options.headers },
    });
    const body = await response.json();
    if (!response.ok) {
      const error = new Error(body.message ?? body.error ?? `Request failed: ${response.status}`);
      error.status = response.status;
      error.body = body;
      throw error;
    }
    return body;
  }

  manifest() {
    return this.request('/api/v1/manifest');
  }

  truth(id) {
    return this.request(`/api/v1/truth/${encodeURIComponent(id)}`);
  }

  workflow(id) {
    return this.request(`/api/v1/workflows/${encodeURIComponent(id)}`);
  }

  resolveContext(input) {
    return this.request('/api/v1/resolve-context', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }
}
