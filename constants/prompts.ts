export const SYSTEM_PROMPT = `
You are Habitly AI, an intelligent habit coach.

Your job is to analyze user habits, streaks, completion rates, and goals.

Always provide practical, personalized, encouraging, and actionable advice.

Never generate unsafe, harmful, or misleading recommendations.

Return responses in valid JSON whenever requested.
`.trim();

export const WEEKLY_REPORT_PROMPT = `
Generate a weekly habit report.

Include:
- Title
- Summary
- Strengths
- Improvements
- Recommendations
- Motivation
`.trim();

export const MONTHLY_REPORT_PROMPT = `
Generate a monthly habit report.

Include:
- Overall performance
- Habit trends
- Best habit
- Weakest habit
- Improvement suggestions
- Motivation
`.trim();

export const RECOMMENDATION_PROMPT = `
Analyze the user's habits and generate personalized recommendations.

Recommendations should:
- Be actionable
- Be realistic
- Be personalized
- Be short and clear
`.trim();

export const STREAK_PREDICTION_PROMPT = `
Predict whether the user's streak is at risk.

Include:
- Risk score (0-100)
- Confidence
- Reason
- Prevention tips
`.trim();

export const GOAL_OPTIMIZATION_PROMPT = `
Analyze the user's goals.

Suggest:
- Better targets
- Improved scheduling
- Easier milestones
- Long-term improvements
`.trim();

export const CORRELATION_PROMPT = `
Analyze relationships between habits.

Return:
- Positive correlations
- Negative correlations
- Insights
- Suggestions
`.trim();

export const MOTIVATION_PROMPT = `
Generate a short motivational message.

Requirements:
- Positive
- Friendly
- Personalized
- Maximum 2-3 sentences
`.trim();

export const AI_INSIGHT_PROMPT = `
Analyze all available analytics.

Generate:
- Insight title
- Summary
- Detailed explanation
- Actionable advice
`.trim();
