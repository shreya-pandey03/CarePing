import {
  aiQueue,
  recommendationQueue,
  weeklyReportQueue,
  monthlyReportQueue,
} from "@/jobs/queues";

async function cleanQueues() {
  console.log("Cleaning BullMQ queues...");

  await aiQueue.clean(0, 1000, "completed");
  await aiQueue.clean(0, 1000, "failed");

  await recommendationQueue.clean(0, 1000, "completed");
  await recommendationQueue.clean(0, 1000, "failed");

  await weeklyReportQueue.clean(0, 1000, "completed");
  await weeklyReportQueue.clean(0, 1000, "failed");

  await monthlyReportQueue.clean(0, 1000, "completed");
  await monthlyReportQueue.clean(0, 1000, "failed");

  console.log("Queues cleaned successfully");

  process.exit(0);
}

cleanQueues().catch((error) => {
  console.error("Queue cleanup failed:", error);
  process.exit(1);
});
