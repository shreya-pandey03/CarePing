interface PromptOptions {
  userName?: string;

  habits?: string[];

  completionRate?: number;

  consistency?: number;

  currentStreak?: number;

  longestStreak?: number;

  goals?: string[];

  strengths?: string[];

  improvements?: string[];

  recommendations?: string[];

  period?: "daily" | "weekly" | "monthly";
}

export function generatePrompt({
  userName,
  habits = [],
  completionRate = 0,
  consistency = 0,
  currentStreak = 0,
  longestStreak = 0,
  goals = [],
  strengths = [],
  improvements = [],
  recommendations = [],
  period = "weekly",
}: PromptOptions) {
  return `
You are an AI Habit Coach.

Generate a ${period} habit report for ${userName ?? "the user"}.

Habits:
${habits.map((habit) => `- ${habit}`).join("\n")}

Goals:
${goals.map((goal) => `- ${goal}`).join("\n")}

Statistics
- Completion Rate: ${completionRate}%
- Consistency: ${consistency}%
- Current Streak: ${currentStreak}
- Longest Streak: ${longestStreak}

Current Strengths:
${strengths.map((item) => `- ${item}`).join("\n")}

Areas to Improve:
${improvements.map((item) => `- ${item}`).join("\n")}

Previous Recommendations:
${recommendations.map((item) => `- ${item}`).join("\n")}

Return the response in JSON using this structure:

{
  "title": "",
  "summary": "",
  "strengths": [],
  "improvements": [],
  "recommendations": [],
  "motivation": ""
}
`.trim();
}
