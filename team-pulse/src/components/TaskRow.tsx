import React from 'react';
import { Box, Text } from 'ink';
import { Issue } from '../services/jira';

export const TaskRow = ({ issue }: { issue: Issue }) => {
  return (
    <Box>
      <Box width={10}>
        <Text bold>{issue.key}</Text>
      </Box>
      <Box width={20}>
        <Text>{issue.assignee.split(' ')[0]}</Text>
      </Box>
      <Box width={15}>
        <Text color="cyan">{issue.status}</Text>
      </Box>
      <Box width={25}>
        <Text color={issue.isStagnant ? 'red' : 'green'}>
          {issue.isStagnant
            ? `⚠️ +${Math.floor(issue.daysInStatus - issue.storyPoints)} days late`
            : `✅ OK (${Math.floor(issue.daysInStatus)}/${issue.storyPoints}d)`}
        </Text>
      </Box>
    </Box>
  );
};
