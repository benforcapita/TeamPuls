import dotenv from 'dotenv';

dotenv.config();

const required = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
};

export const config = {
  jiraHost: required('JIRA_HOST'),
  jiraUser: required('JIRA_USER'),
  jiraToken: required('JIRA_TOKEN'),
  jiraProjectKey: required('JIRA_PROJECT_KEY'),
  jiraSpField: process.env.JIRA_SP_FIELD || 'customfield_10026',
  ollamaModel: process.env.OLLAMA_MODEL || 'llama3',
  teamMembers: (process.env.TEAM_MEMBERS || '')
    .split(',')
    .map((member) => member.trim())
    .filter(Boolean),
};
