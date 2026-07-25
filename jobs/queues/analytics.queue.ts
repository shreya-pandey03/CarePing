import { Queue } from "bullmq";
import { connection } from "@/lib/bullmq";

export const analyticsQueue = new Queue("analytics", {
  connection,
});