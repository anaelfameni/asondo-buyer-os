/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * Designed for a single Node.js process (the dev server / a single
 * Vercel function instance). Two different instances of the API route
 * will keep separate counters → in serverless production, swap this
 * for Upstash, Redis, or a similar shared store.
 *
 * The store is keyed by an arbitrary string (typically `${scope}:${ip}`).
 * Each entry holds the timestamps of recent hits; the limiter prunes them
 * when checking, so the map self-cleans without a separate sweep task.
 */

interface Bucket {
  hits: number[];
}

const STORE = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

export interface RateLimitOptions {
  /** Window length in milliseconds. */
  windowMs: number;
  /** Maximum number of allowed hits within the window. */
  max: number;
}

export function rateLimit(key: string, opts: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const cutoff = now - opts.windowMs;

  const bucket = STORE.get(key) ?? { hits: [] };
  // Drop hits older than the window.
  bucket.hits = bucket.hits.filter((t) => t > cutoff);

  if (bucket.hits.length >= opts.max) {
    const oldest = bucket.hits[0];
    const retryAfterMs = Math.max(0, oldest + opts.windowMs - now);
    STORE.set(key, bucket);
    return { allowed: false, remaining: 0, retryAfterMs };
  }

  bucket.hits.push(now);
  STORE.set(key, bucket);
  return {
    allowed: true,
    remaining: Math.max(0, opts.max - bucket.hits.length),
    retryAfterMs: 0,
  };
}

/**
 * Best-effort client IP extraction for Next.js Edge/Node requests.
 * Falls back to "anonymous" so the limiter still works in dev.
 */
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "anonymous";
}
