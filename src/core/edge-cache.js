export class EdgeCache {
  constructor(config = {}) {
    this.config = {
      ttl: config.ttl || 3600,
      staleWhileRevalidate: config.staleWhileRevalidate || 300,
      regions: config.regions || ['default'],
      ...config
    };
    
    this.cache = new Map();
    this.revalidating = new Set();
  }

  async get(key, fetcher) {
    const cached = this.cache.get(key);
    
    if (cached) {
      const now = Date.now();
      if (now < cached.expires) {
        return cached.value;
      }
      
      if (now < cached.staleUntil) {
        this.revalidateAsync(key, fetcher);
        return cached.value;
      }
    }

    return this.set(key, await fetcher());
  }

  set(key, value) {
    const now = Date.now();
    this.cache.set(key, {
      value,
      expires: now + (this.config.ttl * 1000),
      staleUntil: now + ((this.config.ttl + this.config.staleWhileRevalidate) * 1000)
    });
    return value;
  }

  async revalidateAsync(key, fetcher) {
    if (this.revalidating.has(key)) return;
    
    this.revalidating.add(key);
    try {
      const value = await fetcher();
      this.set(key, value);
    } finally {
      this.revalidating.delete(key);
    }
  }

  invalidate(key) {
    this.cache.delete(key);
  }

  async warmup(keys, fetcher) {
    return Promise.all(
      keys.map(key => this.get(key, () => fetcher(key)))
    );
  }
}