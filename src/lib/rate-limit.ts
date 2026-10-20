type RateLimitRule = {
  windowMs: number
  max: number
}

type RateLimitResult = {
  allowed: boolean
  limit: number
  remaining: number
  resetAt: number
  retryAfterSeconds: number
}

type Bucket = {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

function now() {
  return Date.now()
}

function cleanupExpiredBuckets() {
  const current = now()
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= current) {
      buckets.delete(key)
    }
  }
}

export function checkRateLimit(key: string, rule: RateLimitRule): RateLimitResult {
  cleanupExpiredBuckets()

  const current = now()
  const existing = buckets.get(key)

  if (!existing || existing.resetAt <= current) {
    const resetAt = current + rule.windowMs
    buckets.set(key, { count: 1, resetAt })
    return {
      allowed: true,
      limit: rule.max,
      remaining: Math.max(rule.max - 1, 0),
      resetAt,
      retryAfterSeconds: Math.ceil(rule.windowMs / 1000),
    }
  }

  if (existing.count >= rule.max) {
    return {
      allowed: false,
      limit: rule.max,
      remaining: 0,
      resetAt: existing.resetAt,
      retryAfterSeconds: Math.max(Math.ceil((existing.resetAt - current) / 1000), 1),
    }
  }

  existing.count += 1

  return {
    allowed: true,
    limit: rule.max,
    remaining: Math.max(rule.max - existing.count, 0),
    resetAt: existing.resetAt,
    retryAfterSeconds: Math.max(Math.ceil((existing.resetAt - current) / 1000), 1),
  }
}
