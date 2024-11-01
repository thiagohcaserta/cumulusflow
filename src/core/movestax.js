import { MovestaxAdapter } from '../adapters/movestax.js';
import { EdgeCache } from './edge-cache.js';
import { ConnectionPool } from './connection-pool.js';
import { ColdStartOptimizer } from './cold-start.js';

export class MovestaxController {
  constructor(config = {}) {
    this.config = config;
    this.adapter = new MovestaxAdapter(config);
    this.cache = new EdgeCache({
      ttl: config.cacheTTL || 3600,
      regions: config.regions || ['auto']
    });
    this.pool = new ConnectionPool({
      maxConnections: config.maxConnections || 100
    });
    this.optimizer = new ColdStartOptimizer();
  }

  async handle(request, context) {
    await this.optimizer.initialize();
    
    const normalizedRequest = this.adapter.normalizeRequest(request, context);
    
    // Check edge cache first
    const cacheKey = this.getCacheKey(normalizedRequest);
    const cachedResponse = await this.cache.get(cacheKey);
    if (cachedResponse) {
      return this.adapter.normalizeResponse(cachedResponse);
    }

    // Handle serverless function
    const connection = await this.pool.acquire();
    try {
      const response = await this.processRequest(normalizedRequest, connection);
      if (this.isCacheable(response)) {
        await this.cache.set(cacheKey, response.clone());
      }
      return this.adapter.normalizeResponse(response);
    } finally {
      await this.pool.release(connection);
    }
  }

  async deploy() {
    // Implementation for deployment to Movestax
    const deploymentConfig = {
      ...this.config,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version
    };

    // Add deployment logic here
    console.log('Deploying with config:', deploymentConfig);
  }

  getCacheKey(request) {
    const url = new URL(request.url);
    return `${request.method}:${url.pathname}${url.search}`;
  }

  isCacheable(response) {
    const cacheControl = response.headers.get('cache-control');
    return response.status === 200 && 
           (!cacheControl || !cacheControl.includes('no-store'));
  }

  async processRequest(request, connection) {
    const startTime = Date.now();
    
    try {
      const response = await connection.execute(request);
      
      const headers = new Headers(response.headers);
      headers.set('x-movestax-execution-time', Date.now() - startTime);
      headers.set('x-movestax-connection-id', connection.id);
      
      return new Response(response.body, {
        status: response.status,
        headers
      });
    } catch (error) {
      console.error('Movestax execution error:', error);
      throw error;
    }
  }
}