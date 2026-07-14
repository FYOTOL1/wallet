import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import "dotenv/config";

const redis = Redis.fromEnv();
const rateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(4, "60 s"), // 100 Request Per 60s
});

export default rateLimit;
