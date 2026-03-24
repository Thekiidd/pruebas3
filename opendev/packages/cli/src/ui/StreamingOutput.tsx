/** @jsxRuntime classic */
/** @jsx React.createElement */
import React from 'react';
import { Box, Text } from 'ink';
import { StreamChunk } from '@opendev/core';

interface StreamingOutputProps {
  chunks: StreamChunk[];
}

export function StreamingOutput({ chunks }: StreamingOutputProps) {
  const text = chunks
    .filter(c => c.type === 'text')
    .map(c => c.content ?? '')
    .join('');

  return (
    <Box>
      <Text>{text}</Text>
    </Box>
  );
}
