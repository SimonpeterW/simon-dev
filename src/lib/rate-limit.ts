// Sliding-window rate limiter kept in memory. On serverless (Vercel) each
// instance has its own memory, so this throttles bursts per instance; swap in
// Upstash Redis (@upstash/ratelimit) if you need a global limit.

type Bucket = number[];
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, { limit, windowMs }: { limit: number; windowMs: number }) {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);

  if (hits.length >= limit) {
    buckets.set(key, hits);
    const retryAfter = Math.ceil((windowMs - (now - hits[0])) / 1000);
    return { success: false as const, retryAfter };
  }

  hits.push(now);
  buckets.set(key, hits);

  // Keep the map from growing forever.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (v.every((t) => now - t >= windowMs)) buckets.delete(k);
    }
  }

  return { success: true as const, remaining: limit - hits.length };
}

export function clientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown"
  );
}
