import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: 'https://eu2-capable-terrapin-31417.upstash.io',
  token:process.env.REDIS_KEY!,
})