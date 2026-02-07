import React from 'react';
import { Box, Text } from 'ink';

export const Summary = ({ issues }: { issues: any[] }) => {
  const counts: any = { 'To Do': 0, 'In Progress': 0, 'Review': 0, 'Testing': 0 };

  issues.forEach((i) => {
    // Simple mapping (adjust strings to match your Jira workflows)
    if (i.status.match(/To Do|Open|Backlog/i)) counts['To Do']++;
    else if (i.status.match(/Progress|Dev/i)) counts['In Progress']++;
    else if (i.status.match(/Review/i)) counts['Review']++;
    else counts['Testing']++;
  });

  return (
    <Box borderStyle="round" paddingX={1} borderColor="cyan">
      <Text>📊 </Text>
      <Text color="grey">Todo: </Text>
      <Text bold>{counts['To Do']}  </Text>
      <Text color="blue">Dev: </Text>
      <Text bold>{counts['In Progress']}  </Text>
      <Text color="yellow">Review: </Text>
      <Text bold>{counts['Review']}  </Text>
      <Text color="magenta">Testing: </Text>
      <Text bold>{counts['Testing']}</Text>
    </Box>
  );
};
