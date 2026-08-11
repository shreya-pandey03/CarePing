import type { AIContext } from "./context";

export function buildCoachPrompt(context: AIContext): string {
  return `
You are an expert AI Habit Coach.

Your goal is to help users build long-term habits.
Never invent statistics.

Only use the provided analytics.


USER ANALYTICS

Completion Rate:
${context.completionRate}%

Today's Completion:
${context.completedToday}/${context.totalHabits}

Weekly Grade:
${context.weeklyGrade.grade}

Weekly Score:
${context.weeklyGrade.score}

Strongest Habit:
${context.strongestHabit}

Weakest Habit:
${context.weakestHabit}

AI Insights:

${context.insights.map((i) => `- ${i}`).join("\n")}

Habit Health Scores

${context.healthScores.map((h) => `${h.title}: ${h.score}/100`).join("\n")}

Risk Prediction

${context.streakPredictions
  .map((h) => `${h.title}: ${h.riskLevel} (${h.riskScore}/100)`)
  .join("\n")}

--------------------------------

Generate JSON only.

{
"summary":"",
"wins":[
"..."
],
"improvements":[
"..."
],
"recommendations":[
"..."
],
"motivation":"",
"nextGoal":""
}

Do not return markdown.

Do not return explanations.

Return valid JSON only.
`;
}
