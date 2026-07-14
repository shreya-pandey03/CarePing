/*habit report prompt */
export interface HabitPromptData {
  habits: {
    id: string;
    title: string;
    category: string;
  }[];

  goals: {
    id: string;
    title: string;
    targetValue: number;
    currentValue: number;
    status: string;
  }[];

  logs: {
    completedAt: Date;
  }[];

  streaks: {
    currentStreak: number;
    longestStreak: number;
  }[];
}

/* AI Insight Prompt*/
export function buildInsightPrompt(data: HabitPromptData) {
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

/* Weekly Report Prompt*/
export function buildWeeklyReportPrompt(data: HabitPromptData) {
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

/* Monthly Report Prompt*/
export function buildMonthlyReportPrompt(data: HabitPromptData) {
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

/* Daily Recommendation Prompt*/
export function buildRecommendationPrompt(data: HabitPromptData) {
  return `
You are an AI Habit Coach.

Analyze the user's habits, goals and streaks.

${JSON.stringify(data, null, 2)}

Return ONLY valid JSON.

{
  "recommendations": [
    {
      "title": "",
      "description": "",
      "priority": 1
    }
  ]
}

Rules:

- Give 3 recommendations.
- Priority must be between 1 and 5.
- No markdown.
- JSON only.
`;
}

/* Goal Optimization Prompt*/
export function buildGoalPrompt(goal: string, data: HabitPromptData) {
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

/*New Habit Suggestion Prompt*/
export function buildNewHabitPrompt(data: HabitPromptData) {
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

/*Habit Correlation Prompt*/
export function buildCorrelationPrompt(data: HabitPromptData) {
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

/* Motivation Prompt*/
export function buildMotivationPrompt(currentStreak: number) {
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

/* goalsuggestion prompt */
export function buildGoalSuggestionPrompt(data: {
  goals: any[];
  habits: any[];
  streaks: any[];
}) {
  return `
You are an AI Habit Coach.

Analyze the user's goals, habits and streaks.

${JSON.stringify(data, null, 2)}

Return ONLY valid JSON.

{
  "suggestions": [
    {
      "title": "",
      "description": "",
      "targetValue": 30,
      "deadline": "2026-08-01",
      "reason": ""
    }
  ]
}

Rules:
- Suggest 3 goals.
- Make them realistic.
- Return JSON only.
`;
}

export function buildHabitSuggestionPrompt(data: {
  habits: any[];
  goals: any[];
  streaks: any[];
}) {
  return `
You are an AI Habit Coach.

Analyze the user's habits, goals and streaks.

${JSON.stringify(data, null, 2)}

Return ONLY valid JSON.

{
  "suggestions": [
    {
      "title": "",
      "description": "",
      "category": "health",
      "frequency": "daily",
      "reason": ""
    }
  ]
}

Rules:

- Suggest exactly 3 habits.
- Frequency must be daily, weekly or monthly.
- Category must match the existing habit categories.
- Return JSON only.
`;
}

export function buildGoalOptimizationPrompt(data: {
  goals: {
    title: string;
    description: string | null;
    targetValue: number;
    currentValue: number;
    status: string;
  }[];
}) {
  return `
You are an AI goal optimization coach.

Analyze the user's current goals.

Goals:

${JSON.stringify(data.goals, null, 2)}


Suggest optimized goals.

Return JSON only.

[
 {
   "title":"",
   "description":"",
   "targetValue":0,
   "deadline":"",
   "reason":""
 }
]


Rules:

- Make goals realistic.
- Improve consistency.
- Break large goals into achievable targets.
- Give practical deadlines.
`;
}
