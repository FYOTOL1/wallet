import { NextFunction, Request, Response } from "express";
import rateLimit from "../config/upstash";

const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { success } = await rateLimit.limit("my-rate-limit");

    if (!success)
      return res
        .status(429)
        .json({ message: "Too many requests, please try again later." });

    return next();
  } catch (error) {
    console.log("Rate Limit Error: ", error);
    next(error);
  }
};

export default rateLimiter;
