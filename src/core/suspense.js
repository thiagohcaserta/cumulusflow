export class SuspenseController {
  constructor() {
    this.cache = new Map();
    this.promises = new Map();
  }

  async load(key, fetcher) {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    if (!this.promises.has(key)) {
      this.promises.set(key, fetcher().then(data => {
        this.cache.set(key, data);
        this.promises.delete(key);
        return data;
      }));
    }

    return this.promises.get(key);
  }

  invalidate(key) {
    this.cache.delete(key);
    this.promises.delete(key);
  }
}