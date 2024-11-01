export function loggingMiddleware(options = {}) {
  return async (request, next) => {
    const start = Date.now();
    const requestId = crypto.randomUUID();
    
    const logContext = {
      requestId,
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers),
      timestamp: new Date().toISOString()
    };

    try {
      const response = await next(request);
      
      const duration = Date.now() - start;
      const responseContext = {
        ...logContext,
        status: response.status,
        duration,
        coldStart: global.__COLD_START__,
        region: process.env.REGION || 'unknown'
      };

      console.log(JSON.stringify(responseContext));
      
      return response;
    } catch (error) {
      const errorContext = {
        ...logContext,
        error: {
          message: error.message,
          stack: error.stack,
          code: error.code
        },
        duration: Date.now() - start
      };

      console.error(JSON.stringify(errorContext));
      throw error;
    }
  };
}