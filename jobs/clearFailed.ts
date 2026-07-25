import {
  aiQueue,
  recommendationQueue,
  weeklyReportQueue,
  monthlyReportQueue,
} from "./queues";

async function clearFailedQueues() {
  const queues = [
    aiQueue,
    recommendationQueue,
    weeklyReportQueue,
    monthlyReportQueue,
  ];

  for (const queue of queues) {
    await queue.clean(0, 1000, "failed");
  }

  console.log("All failed jobs cleared");

  process.exit(0);
}

clearFailedQueues();
