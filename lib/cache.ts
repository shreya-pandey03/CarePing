import { redis } from "./redis";

export async function getDashboardCache(userId: string) {
  const cached = await redis.get(`dashboard:${userId}`);

  if (cached) {
    return JSON.parse(cached);
  }

  return null;
}

export async function setDashboardCache(userId: string, data: unknown) {
  await redis.set(`dashboard:${userId}`, JSON.stringify(data), "EX", 300);
}
