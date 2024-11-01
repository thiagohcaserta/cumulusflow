import { BaseAdapter } from './base.js';

export class MovestaxAdapter extends BaseAdapter {
  constructor(config = {}) {
    super();
    this.config = {
      region: config.region || 'auto',
      maxDuration: config.maxDuration || 60000,
      memory: config.memory || '128MB',
      ...config
    };
  }

  normalizeRequest(request, context) {
    // Add Movestax-specific headers
    const headers = new Headers(request.headers);
    headers.set('x-movestax-region', context.region);
    headers.set('x-movestax-request-id', context.requestId);
    
    return new Request(request.url, {
      method: request.method,
      headers,
      body: request.body,
      signal: request.signal
    });
  }

  normalizeResponse(response) {
    const headers = new Headers(response.headers);
    headers.set('x-powered-by', 'Movestax');
    headers.set('server-timing', this.getServerTiming());
    
    return new Response(response.body, {
      status: response.status,
      headers
    });
  }

  getServerTiming() {
    return [
      'edge;dur=1',
      `region;desc="${this.config.region}"`,
      'cache;desc="HIT"'
    ].join(', ');
  }
}