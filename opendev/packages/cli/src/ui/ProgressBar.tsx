/** @jsxRuntime classic */
/** @jsx React.createElement */
import React from 'react';
import { Box, Text } from 'ink';

interface ProgressBarProps {
  value: number;
  max?: number;
  width?: number;
  label?: string;
}

export function ProgressBar({ value, max = 100, width = 20, label }: ProgressBarProps) {
  const filled = Math.round((value / max) * width);
  const empty = width - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  const percent = Math.round((value / max) * 100);

  return (
    <Box>
      {label && <Text>{label} </Text>}
      <Text color="cyan">[{bar}]</Text>
      <Text dimColor> {percent}%</Text>
    </Box>
  );
}
