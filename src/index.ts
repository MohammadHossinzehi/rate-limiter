export interface RateLimiter {
  allow(): boolean;
  getRemaining(): number;
}

export class TokenBucket implements RateLimiter {
  private tokens: number;
  private maxTokens: number;
  private refillRate: number;
  private lastRefillTime: number;

  constructor(capacity: number, refillPerSec: number) {
    this.tokens = capacity;
    this.maxTokens = capacity;
    this.refillRate = refillPerSec;
    this.lastRefillTime = Date.now();
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = (now - this.lastRefillTime) / 1000;
    const tokensToAdd = elapsed * this.refillRate;
    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefillTime = now;
  }

  allow(requestCount: number = 1): boolean {
    this.refill();
    if (this.tokens >= requestCount) {
      this.tokens -= requestCount;
      return true;
    }
    return false;
  }

  getRemaining(): number {
    this.refill();
    return Math.floor(this.tokens);
  }
}

export class SlidingWindow implements RateLimiter {
  private requests: number[] = [];
  private limit: number;
  private windowSizeMs: number;

  constructor(limit: number, windowSec: number) {
    this.limit = limit;
    this.windowSizeMs = windowSec * 1000;
  }

  private prune(): void {
    const now = Date.now();
    this.requests = this.requests.filter(t => now - t < this.windowSizeMs);
  }

  allow(requestCount: number = 1): boolean {
    this.prune();
    if (this.requests.length + requestCount <= this.limit) {
      this.requests.push(...Array(requestCount).fill(Date.now()));
      return true;
    }
    return false;
  }

  getRemaining(): number {
    this.prune();
    return this.limit - this.requests.length;
  }
}
