# Rate Limiting in CumulusFlow

CumulusFlow includes built-in rate limiting to help control costs and prevent abuse in serverless environments.

## Configuration

In your `cumulus.config.ts`:

```typescript
import { defineConfig } from 'cumulusflow/config';

export default defineConfig({
  name: 'my-app',
  rateLimit: {
    windowMs: 60000, // 1 minute
    max: 100, // max requests per minute
    burst: 5, // max burst
    costPerRequest: 1 // cost units per request
  }
});
```

## Parameters

- `windowMs`: Time window for rate limiting (in milliseconds)
- `max`: Maximum number of requests allowed per window
- `burst`: Maximum burst size (allows temporary spikes)
- `costPerRequest`: Cost units per request (useful for different endpoint weights)

## Usage Example

```typescript
// api/expensive-operation.ts
export const config = {
  rateLimit: {
    costPerRequest: 5 // This endpoint costs 5 units
  }
};

export default async function handler(req) {
  // Your expensive operation here
  return new Response('Success');
}
```

## Headers

Rate limit information is included in response headers:

- `X-RateLimit-Limit`: Max requests per window
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Time until window reset
- `Retry-After`: Seconds until next available request (when limited)

## Best Practices

1. Set appropriate limits based on your serverless provider's pricing
2. Use different costs for expensive operations
3. Monitor rate limit metrics
4. Implement graceful fallbacks for rate-limited requests