import { MovestaxController } from './movestax.js';
import { ColdStartOptimizer } from './cold-start.js';

export class Runtime {
  constructor(config = {}) {
    this.config = config;
    this.movestax = new MovestaxController(config.movestax);
    this.optimizer = new ColdStartOptimizer();
    
    // Initialize cold start optimization
    this.optimizer.initialize();
  }

  async handle(request, context) {
    // Add runtime context
    context = {
      ...context,
      startTime: Date.now(),
      coldStart: !this.optimizer.initialized
    };

    try {
      // Handle request through Movestax
      return await this.movestax.handle(request, context);
    } catch (error) {
      console.error('Runtime error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
}