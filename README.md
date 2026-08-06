# rate-limiter

Production-grade rate limiting library with token bucket, sliding window, and adaptive strategies.

## Features

- **Token Bucket**: Classic token bucket algorithm for smooth rate limiting
- **Sliding Window**: Request counting within a time window for precise rate control
- **Adaptive Limiting**: Automatic adjustment based on error rates to handle load spikes
- **Zero Dependencies**: Pure TypeScript, no external libraries required
- **Type Safe**: Full TypeScript support with complete type definitions

## Installation

```bash
npm install @rate-limiter/rate-limiter
```

## Usage

### Token Bucket

```typescript
import { TokenBucket } from '@rate-limiter/rate-limiter';

const limiter = new TokenBucket(100, 10); // 100 tokens, refill 10/sec

if (limiter.allow()) {
  // Process request
}
```

### Sliding Window

```typescript
import { SlidingWindow } from '@rate-limiter/rate-limiter';

const limiter = new SlidingWindow(1000, 60); // 1000 requests per 60 seconds

if (limiter.allow(5)) { // Allow 5 requests
  // Process requests
}
```

## Design Decisions

- **Token Bucket** uses high-precision timing to handle refills accurately
- **Sliding Window** maintains request history and prunes stale entries automatically
- Both implementations use wall-clock time (Date.now) rather than process uptime for reliability
- Remaining capacity calculations include fresh refills to provide accurate snapshots

## Testing

```bash
npm test
```

## Performance

- Token Bucket: O(1) per allow() call
- Sliding Window: O(n) worst-case, O(1) amortized with pruning
- Memory overhead is minimal; suitable for millions of concurrent limiters

## License

MIT
