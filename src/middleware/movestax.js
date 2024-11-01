export function movestaxMiddleware(options = {}) {
  return async (request, next) => {
    const region = request.headers.get('x-movestax-region');
    const requestId = request.headers.get('x-movestax-request-id');

    // Add Movestax context to request
    request.movestax = {
      region,
      requestId,
      startTime: Date.now()
    };

    try {
      const response = await next(request);
      
      // Add Movestax headers
      const headers = new Headers(response.headers);
      headers.set('x-movestax-region', region);
      headers.set('x-movestax-request-id', requestId);
      headers.set('x-movestax-execution-time', Date.now() - request.movestax.startTime);

      return new Response(response.body, {
        status: response.status,
        headers
      });
    } catch (error) {
      console.error('Movestax middleware error:', error);
      throw error;
    }
  };
}