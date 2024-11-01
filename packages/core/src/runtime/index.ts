import { MovestaxController } from './movestax';
import { ColdStartOptimizer } from './cold-start';
import type { RuntimeConfig } from '../types';

export class Runtime {
  private movestax: MovestaxController;
  private optimizer: ColdStartOptimizer;

  constructor(config: RuntimeConfig = {}) {
    this.movestax = new MovestaxController(config.movestax);
    this.optimizer = new ColdStartOptimizer();
    this.optimizer.initialize();
  }

  async handle(request: Request, context: Record<string, any> = {}) {
    context.startTime = Date.now();
    context.coldStart = !this.optimizer.initialized;

    try {
      return await this.movestax.handle(request, context);
    } catch (error) {
      console.error('Runtime error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
}