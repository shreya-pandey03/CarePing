import { Worker } from "bullmq";
import { connection } from "@/lib/bullmq";

export const analyticsWorker = new Worker(
  "analytics",
  async (job) => {
    console.log("Analytics Worker");
    console.log(job.name);
    console.log(job.data);
  },
  {
    connection,
  },
);