export function cacheMiddleware(options = {}) {
  const cache = new Map();

  return async (request, next) => {
    const url = new URL(request.url);
    const cacheKey = `${request.method}:${url.pathname}`;

    if (request.method === 'GET') {
      const cached = cache.get(cacheKey);
      if (cached) {
        const { response, expires } = cached;
        if (Date.now() < expires) {
          return response.clone();
        }
        cache.delete(cacheKey);
      }
    }

    const response = await next(request);
    
    if (request.method === 'GET' && response.status === 200) {
      const expires = Date.now() + (options.maxAge || 60000);
      cache.set(cacheKey, {
        response: response.clone(),
        expires
      });
    }

    return response;
  };
}