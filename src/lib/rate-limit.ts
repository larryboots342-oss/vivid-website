import { LRUCache } from "lru-cache";

interface RateLimitOptions {
  interval: number;
  uniqueTokenPerInterval?: boolean;
}

export function rateLimit(options: RateLimitOptions) {
  const tokenCache = new LRUCache<string, number[]>({
    max: 500,
    ttl: options.interval,
  });
  return {
    check: (token: string, limit: number) => {
      const tokenCount = tokenCache.get(token) || [0];
      if (tokenCount[0] === 0) {
        tokenCache.set(token, [1]);
      } else {
        tokenCount[0] += 1;
        tokenCache.set(token, tokenCount);
      }
      if (tokenCount[0] > limit) {
        throw new Error("Rate limit exceeded");
      }
    },
  };
}
