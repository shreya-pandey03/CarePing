import "./streak.worker";
import "./ai.worker";
import "./recommendations.worker";
import "./weekly-report.worker";
import "./monthly-report.worker";
import "./notification.worker";
import "./analytics.worker";
import "./cache.worker";
import "./cleanup.worker";
import "./analytics.worker";

console.log(" Habitly Workers Started");
console.log("Workers started");
process.on("SIGINT", () => {
  console.log("Stopping workers...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("Stopping workers...");
  process.exit(0);
});
