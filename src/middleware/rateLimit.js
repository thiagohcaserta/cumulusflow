import { RateLimiter } from '../utils/rateLimiter.js';

export class RateLimitMiddleware {
  constructor(config) {
    this.limiter = new RateLimiter({
      windowMs: config.windowMs || 60000, // 1 minute default
      max: config.max || 100, // max requests per window
      burst: config.burst || 5, // max burst
      costPerRequest: config.costPerRequest || 1
    });
  }

  middleware() {
    return async (request, next) => {
      const ip = request.headers.get('x-forwarded-for') || 'unknown';
      const path = new URL(request.url).pathname;
      
      try {
        await this.limiter.consume(`${ip}:${path}`);
        return next(request);
      } catch (error) {
        return new Response('Too Many Requests', {
          status: 429,
          headers: {
            'Retry-After': error.msBeforeNext / 1000
          }
        });
      }
    };
  }
}