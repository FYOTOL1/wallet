import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import "dotenv/config";

const redis = Redis.fromEnv();
const rateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(200, "10 s"), // 200 Request Per 60s
});

export default rateLimit;
