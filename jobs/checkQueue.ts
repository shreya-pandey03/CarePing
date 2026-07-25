import {
  aiQueue,
  recommendationQueue,
  weeklyReportQueue,
  monthlyReportQueue,
} from "./queues";

async function checkQueues() {
  console.log("\nAI Queue:");
  console.log(await aiQueue.getJobCounts());

  console.log("\nRecommendation Queue:");
  console.log(await recommendationQueue.getJobCounts());

  console.log("\nWeekly Report Queue:");
  console.log(await weeklyReportQueue.getJobCounts());

  console.log("\nMonthly Report Queue:");
  console.log(await monthlyReportQueue.getJobCounts());

  process.exit(0);
}

checkQueues();
