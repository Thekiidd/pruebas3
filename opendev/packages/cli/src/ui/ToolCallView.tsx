/** @jsxRuntime classic */
/** @jsx React.createElement */
import React from 'react';
import { Box, Text } from 'ink';

interface ToolCallViewProps {
  toolName: string;
  args: Record<string, unknown>;
  result?: string;
}

export function ToolCallView({ toolName, args, result }: ToolCallViewProps) {
  return (
    <Box flexDirection="column" borderStyle="round" borderColor="yellow" padding={1}>
      <Text bold color="yellow">🔧 Tool Call: {toolName}</Text>
      <Text dimColor>Args: {JSON.stringify(args, null, 2)}</Text>
      {result && <Text color="green">Result: {result.slice(0, 200)}</Text>}
    </Box>
  );
}
