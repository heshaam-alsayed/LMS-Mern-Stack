import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis = new Redis(process.env.REDIS_URL as string);

redis.on("connect", () => {
  console.log(" Redis connected successfully");
});

redis.on("error", (err) => {
  console.error("Redis error", err);
});


export const getCached = async <T>(key: string): Promise<T | null> => {
  try {
    const raw = await redis.get(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const setCached = async (
  key: string,
  value: unknown,
  ttlSeconds: number,
) => {
  try {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch {}
};
export const delCached = async (...keys: string[]) => {
  try {
    if (keys.length > 0) await redis.del(...keys);
  } catch {}
};


export const sessionKey = (userId: string) => `session:${userId}`;

export const userPublicKey = (userId: string) => `user:public:${userId}`;

export const sanitizeUser = (user: any) => {
  const plain =
    user && typeof user.toObject === "function" ? user.toObject() : user;
  if (!plain) return plain;
  const { password, ...rest } = plain;
  return rest;
};

export default redis;