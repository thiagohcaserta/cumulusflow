import { Router } from './router.js';
import { createStore } from './store.js';
import { setupMiddleware } from '../middleware/index.js';

export class App {
  constructor(config = {}) {
    this.router = new Router(config);
    this.store = createStore();
    this.config = config;
    
    // Setup default middleware
    setupMiddleware(this, config);
  }

  use(middleware) {
    this.router.use(middleware);
    return this;
  }

  route(path, handler, options = {}) {
    this.router.add(path, handler, options);
    return this;
  }

  async handle(request) {
    return this.router.handle(request);
  }

  setState(key, value) {
    this.store.set(key, value);
    return this;
  }

  getState(key) {
    return this.store.get(key);
  }

  start(port = 3000) {
    const server = createServer(async (req, res) => {
      const response = await this.handle(req);
      res.writeHead(response.status, response.headers);
      res.end(response.body);
    });

    server.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });

    return server;
  }
}