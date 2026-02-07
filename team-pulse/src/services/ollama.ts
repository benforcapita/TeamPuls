import ollama from 'ollama';
import { config } from '../config';

export async function getAgentAdvice(issue: any) {
  if (!issue.isStagnant) return null;

  const prompt = `
    You are a helpful Agile Team Lead assistant.
    Review this stuck Jira ticket:
    - Task: ${issue.key} "${issue.summary}"
    - Assignee: ${issue.assignee}
    - Status: "${issue.status}" for ${Math.floor(issue.daysInStatus)} days.
    - Estimate: ${issue.storyPoints} Story Points (Days).
    
    The task is taking longer than the estimate. 
    1. Assess severity (Low/Medium/High).
    2. Suggest a polite Slack message to the developer to ask if they are blocked.
    Format: "Severity: [Level] | Message: [Text]"
  `;

  try {
    const response = await ollama.chat({
      model: config.ollamaModel,
      messages: [{ role: 'user', content: prompt }],
    });
    return response.message.content;
  } catch (e) {
    return 'Agent Error: Ensure Ollama is running locally.';
  }
}
