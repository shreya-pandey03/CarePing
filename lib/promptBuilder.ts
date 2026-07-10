export interface HabitPromptData {
  habits: {
    id: string;
    title: string;
    category: string;
  }[];

  logs: {
    completedAt: Date;
  }[];

  streaks: {
    currentStreak: number;
    longestStreak: number;
  }[];
}

/**
 * -----------------------------
 * AI Insight Prompt
 * -----------------------------
 */

export function buildInsightPrompt(
  data: HabitPromptData
) {
  return `
You are an AI Habit Coach.

Analyze the following habit data.

Habits:

${JSON.stringify(data.habits, null, 2)}

Habit Logs:

${JSON.stringify(data.logs, null, 2)}

Streaks:

${JSON.stringify(data.streaks, null, 2)}

Generate a JSON response only.

{
"title":"",
"summary":"",
"content":""
}

Rules:

- Mention positive progress.
- Mention habits at risk.
- Suggest one improvement.
- Keep summary under 60 words.
- Keep content under 250 words.
`;
}

/**
 * -----------------------------
 * Weekly Report Prompt
 * -----------------------------
 */

export function buildWeeklyReportPrompt(
  data: HabitPromptData
) {
  return `
You are an AI productivity coach.

Generate a weekly habit report.

Habit Data:

${JSON.stringify(data, null, 2)}

Return JSON only.

{
"title":"",
"summary":"",
"strengths":[
"",
""
],
"improvements":[
"",
""
],
"recommendations":[
"",
""
]
}

Rules:

- Be encouraging.
- Mention consistency.
- Mention streaks.
- Give practical advice.
`;
}

/**
 * -----------------------------
 * Monthly Report Prompt
 * -----------------------------
 */

export function buildMonthlyReportPrompt(
  data: HabitPromptData
) {
  return `
Generate a monthly performance report.

Habit Data

${JSON.stringify(data, null, 2)}

Return JSON only.

{
"title":"",
"summary":"",
"wins":[
"",
""
],
"losses":[
"",
""
],
"nextMonthGoals":[
"",
""
]
}
`;
}

/**
 * -----------------------------
 * Daily Recommendation Prompt
 * -----------------------------
 */

export function buildRecommendationPrompt(
  data: HabitPromptData
) {
  return `
You are an AI habit coach.

Based on the following data,

${JSON.stringify(data, null, 2)}

Generate JSON only.

{
"recommendations":[
"",
"",
""
]
}

Recommendations should:

- Improve consistency
- Reduce missed habits
- Increase streaks
- Be realistic
`;
}

/**
 * -----------------------------
 * Goal Optimization Prompt
 * -----------------------------
 */

export function buildGoalPrompt(
  goal: string,
  data: HabitPromptData
) {
  return `
Current Goal

${goal}

Habit Data

${JSON.stringify(data, null, 2)}

Return JSON

{
"optimizedGoal":"",
"reason":""
}
`;
}

/**
 * -----------------------------
 * New Habit Suggestion Prompt
 * -----------------------------
 */

export function buildNewHabitPrompt(
  data: HabitPromptData
) {
  return `
Analyze this user.

${JSON.stringify(data, null, 2)}

Suggest three habits.

Return JSON.

{
"habits":[
"",
"",
""
]
}
`;
}

/**
 * -----------------------------
 * Habit Correlation Prompt
 * -----------------------------
 */

export function buildCorrelationPrompt(
  data: HabitPromptData
) {
  return `
Analyze correlations between habits.

${JSON.stringify(data, null, 2)}

Return JSON.

{
"correlations":[
"",
"",
""
]
}
`;
}

/**
 * -----------------------------
 * Motivation Prompt
 * -----------------------------
 */

export function buildMotivationPrompt(
  currentStreak: number
) {
  return `
Current Streak:

${currentStreak}

Generate a motivational message.

Return JSON.

{
"message":""
}

Keep it under 40 words.
`;
}