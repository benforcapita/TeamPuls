import React, { useEffect, useState } from 'react';
import { Box, Text, Newline } from 'ink';
import { getTeamIssues, Issue } from '../services/jira';
import { getAgentAdvice } from '../services/ollama';
import { Summary } from './Summary';
import { TaskRow } from './TaskRow';
import { notifyStagnation } from '../services/notifier';

export const Dashboard = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [advice, setAdvice] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    const { data } = await getTeamIssues();
    setIssues(data);
    setLoading(false);

    // Filter for dangerous stagnation
    const critical = data.find((i) => i.isStagnant);
    if (critical) {
      // Send OS Notification
      notifyStagnation(critical);

      // Trigger AI Agent only if we haven't already (simple check)
      if (!advice) {
        const aiResponse = await getAgentAdvice(critical);
        setAdvice(`🤖 Agent on ${critical.key}:\n${aiResponse}`);
      }
    }
  };

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, 60000); // Poll every minute
    return () => clearInterval(timer);
  }, []);

  return (
    <Box flexDirection="column" padding={1}>
      <Box>
        <Text bold color="green">
          ⚡ TeamPulse{' '}
        </Text>
        <Text color="grey">{loading ? ' (Refreshing...)' : ' (Live)'}</Text>
      </Box>

      <Summary issues={issues} />
      <Newline />

      <Box flexDirection="column">
        <Box>
          <Box width={10}>
            <Text underline>ID</Text>
          </Box>
          <Box width={20}>
            <Text underline>Assignee</Text>
          </Box>
          <Box width={15}>
            <Text underline>Status</Text>
          </Box>
          <Box width={25}>
            <Text underline>Deadline Health</Text>
          </Box>
        </Box>

        {issues.map((issue) => (
          <TaskRow key={issue.key} issue={issue} />
        ))}
      </Box>

      {advice && (
        <Box marginTop={1} padding={1} borderStyle="double" borderColor="red">
          <Text>{advice}</Text>
        </Box>
      )}
    </Box>
  );
};
