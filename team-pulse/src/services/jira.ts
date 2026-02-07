import JiraApi from 'jira-client';
import { cache } from './cache';
import { config } from '../config';

const jira = new JiraApi({
  protocol: 'https',
  host: config.jiraHost,
  username: config.jiraUser,
  password: config.jiraToken,
  apiVersion: '2',
  strictSSL: true,
});

export interface Issue {
  key: string;
  summary: string;
  assignee: string;
  status: string;
  storyPoints: number;
  daysInStatus: number;
  isStagnant: boolean;
  priority: string;
}

export async function getTeamIssues() {
  // 1. Check Cache
  const cached = await cache.get();
  if (cached) return { data: cached, source: 'CACHE' };

  // 2. Fetch Fresh
  const teamMembers = config.teamMembers
    .map((member) => `"${member}"`)
    .join(',');
  const jql = teamMembers
    ? `project = ${config.jiraProjectKey} AND assignee in (${teamMembers}) AND statusCategory != Done`
    : `project = ${config.jiraProjectKey} AND statusCategory != Done`;

  const res = await jira.searchJira(jql);

  const issues: Issue[] = res.issues.map((i: any) => {
    const sp = i.fields[config.jiraSpField] ?? 1; // Default to 1 day if no SP
    const statusDate = new Date(
      i.fields.statuscategorychangedate || i.fields.updated
    );
    const days = (Date.now() - statusDate.getTime()) / (1000 * 60 * 60 * 24);

    return {
      key: i.key,
      summary: i.fields.summary,
      assignee: i.fields.assignee
        ? i.fields.assignee.displayName
        : 'Unassigned',
      status: i.fields.status.name,
      storyPoints: sp,
      daysInStatus: days,
      isStagnant: days > sp, // If days > SP, it's stagnant
      priority: i.fields.priority?.name || 'Unknown',
    };
  });

  // 3. Save Cache
  await cache.set(issues);
  return { data: issues, source: 'API' };
}
