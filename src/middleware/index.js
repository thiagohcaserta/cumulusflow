import { authMiddleware } from './auth.js';
import { rateLimitMiddleware } from './rateLimit.js';
import { corsMiddleware } from './cors.js';
import { cacheMiddleware } from './cache.js';
import { compressionMiddleware } from './compression.js';
import { loggingMiddleware } from './logging.js';

export function setupMiddleware(app, config) {
  // Basic middleware
  app.use(loggingMiddleware());
  app.use(corsMiddleware(config.cors));
  app.use(compressionMiddleware());

  // Cache middleware
  if (config.cache) {
    app.use(cacheMiddleware(config.cache));
  }

  // Rate limiting
  if (config.rateLimit) {
    app.use(rateLimitMiddleware(config.rateLimit));
  }

  // Authentication
  if (config.auth) {
    app.use(authMiddleware(config.auth));
  }

  return app;
}