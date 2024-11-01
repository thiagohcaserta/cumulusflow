import { createEdgeRuntime } from '../runtime.js';
import { parseRoute } from '../utils/routeParser.js';

export class Router {
  constructor(config = {}) {
    this.routes = new Map();
    this.middleware = [];
    this.runtime = createEdgeRuntime(config);
  }

  add(path, handler, options = {}) {
    const route = parseRoute(path);
    this.routes.set(route.pattern, {
      handler,
      params: route.params,
      options
    });
  }

  use(middleware) {
    this.middleware.push(middleware);
  }

  async handle(request) {
    const url = new URL(request.url);
    const match = this.findRoute(url.pathname);

    if (!match) {
      return new Response('Not Found', { status: 404 });
    }

    request.params = match.params;
    
    try {
      let result = request;
      for (const mw of this.middleware) {
        result = await mw(result);
        if (result instanceof Response) return result;
      }
      
      return await match.handler(result);
    } catch (error) {
      console.error('Router error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  findRoute(pathname) {
    for (const [pattern, route] of this.routes) {
      const match = pathname.match(pattern);
      if (match) {
        const params = {};
        route.params.forEach((param, index) => {
          params[param] = match[index + 1];
        });
        return { handler: route.handler, params };
      }
    }
    return null;
  }
}