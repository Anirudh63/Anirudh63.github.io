// src/lib/redis.ts
import { Redis } from '@upstash/redis';

// Initialize Redis client
// You'll need to add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to your .env.local
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});
