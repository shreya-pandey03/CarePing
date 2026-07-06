import { Queue } from "bullmq";

export const aiQueue = new Queue("ai-processing", {
  connection: {
    host: process.env.REDIS_HOST,
    port: 6379,
  },
});
