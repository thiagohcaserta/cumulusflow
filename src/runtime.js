import { Auth0Provider } from './auth/auth0.js';
import { AIAssistant } from './ai/assistant.js';
import { RateLimitMiddleware } from './middleware/rateLimit.js';

export class EdgeRuntime {
  constructor(config) {
    this.router = new Map();
    this.middlewares = [];
    this.auth = new Auth0Provider(config.auth0);
    this.ai = new AIAssistant(config.ai);
    this.state = new Map();

    // Initialize rate limiting if configured
    if (config.rateLimit) {
      this.rateLimiter = new RateLimitMiddleware(config.rateLimit);
      this.use(this.rateLimiter.middleware());
    }
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  route(path, ...handlers) {
    const middleware = handlers.slice(0, -1);
    const finalHandler = handlers[handlers.length - 1];
    
    this.router.set(path, async (request) => {
      let currentRequest = request;
      
      for (const mw of middleware) {
        const response = await mw(currentRequest, req => Promise.resolve(req));
        if (response instanceof Response) return response;
        currentRequest = response || currentRequest;
      }
      
      return finalHandler(currentRequest);
    });
  }

  setState(key, value) {
    this.state.set(key, value);
    this.notifyStateChange(key, value);
  }

  getState(key) {
    return this.state.get(key);
  }

  async handle(request) {
    try {
      const url = new URL(request.url);
      const handler = this.router.get(url.pathname);
      
      if (!handler) {
        return new Response('Not found', { status: 404 });
      }

      let currentRequest = request;
      for (const middleware of this.middlewares) {
        const response = await middleware(currentRequest, req => Promise.resolve(req));
        if (response instanceof Response) return response;
        currentRequest = response || currentRequest;
      }

      return await handler(currentRequest);
    } catch (error) {
      console.error('Runtime error:', error);
      return new Response('Server error', { status: 500 });
    }
  }

  async analyzeCode(code) {
    return this.ai.suggestOptimizations(code);
  }

  async generateTests(code) {
    return this.ai.generateTests(code);
  }
}

export function createEdgeRuntime(config) {
  return new EdgeRuntime(config);
}