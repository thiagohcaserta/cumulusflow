import { TokenBucket } from './tokenBucket.js';

export class RateLimiter {
  constructor(options) {
    this.windowMs = options.windowMs;
    this.max = options.max;
    this.burst = options.burst;
    this.costPerRequest = options.costPerRequest;
    this.buckets = new Map();
  }

  async consume(key, cost = this.costPerRequest) {
    let bucket = this.buckets.get(key);
    
    if (!bucket) {
      bucket = new TokenBucket({
        capacity: this.burst,
        fillRate: this.max / (this.windowMs / 1000),
        fillInterval: 1000
      });
      this.buckets.set(key, bucket);
    }

    const canConsume = await bucket.consume(cost);
    
    if (!canConsume) {
      const msBeforeNext = bucket.msUntilNextToken();
      throw { msBeforeNext };
    }

    return true;
  }
}