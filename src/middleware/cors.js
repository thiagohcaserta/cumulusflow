export function corsMiddleware(options = {}) {
  const defaults = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
  };

  const settings = { ...defaults, ...options };

  return async (request, next) => {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: settings.optionsSuccessStatus,
        headers: {
          'Access-Control-Allow-Origin': settings.origin,
          'Access-Control-Allow-Methods': settings.methods,
          'Access-Control-Allow-Headers': request.headers.get('access-control-request-headers') || '',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    const response = await next(request);
    const headers = new Headers(response.headers);
    
    headers.set('Access-Control-Allow-Origin', settings.origin);
    
    return new Response(response.body, {
      status: response.status,
      headers
    });
  };
}