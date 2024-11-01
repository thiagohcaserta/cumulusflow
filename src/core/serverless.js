import { createEdgeRuntime } from './runtime.js';
import { CloudflareAdapter, VercelAdapter, NetlifyAdapter } from '../adapters/index.js';

export class ServerlessController {
  constructor(config = {}) {
    this.config = config;
    this.runtime = createEdgeRuntime(config);
    this.adapters = new Map([
      ['cloudflare', new CloudflareAdapter()],
      ['vercel', new VercelAdapter()],
      ['netlify', new NetlifyAdapter()]
    ]);
  }

  async handle(request, context) {
    const platform = this.detectPlatform(context);
    const adapter = this.adapters.get(platform);
    
    if (adapter) {
      request = adapter.normalizeRequest(request, context);
      const response = await this.runtime.handle(request);
      return adapter.normalizeResponse(response);
    }

    return this.runtime.handle(request);
  }

  detectPlatform(context) {
    if (context?.cf) return 'cloudflare';
    if (process.env.VERCEL) return 'vercel';
    if (process.env.NETLIFY) return 'netlify';
    return 'generic';
  }

  getAdapter(platform) {
    return this.adapters.get(platform);
  }
}