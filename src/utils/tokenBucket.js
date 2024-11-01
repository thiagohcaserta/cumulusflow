export class TokenBucket {
  constructor({ capacity, fillRate, fillInterval }) {
    this.capacity = capacity;
    this.fillRate = fillRate;
    this.fillInterval = fillInterval;
    this.tokens = capacity;
    this.lastFill = Date.now();
  }

  refill() {
    const now = Date.now();
    const timePassed = now - this.lastFill;
    const tokensToAdd = (timePassed / this.fillInterval) * this.fillRate;
    
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastFill = now;
  }

  async consume(tokens) {
    this.refill();
    
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    
    return false;
  }

  msUntilNextToken() {
    this.refill();
    const tokensNeeded = 1 - this.tokens;
    return Math.ceil((tokensNeeded / this.fillRate) * this.fillInterval);
  }
}