/** @jsxRuntime classic */
/** @jsx React.createElement */
import React from 'react';
import { Box, Text } from 'ink';

const JUPITER_ASCII = `
   ____                   _             _ _            
  / __ \\                 | |           (_) |           
 | |  | |_ __   ___ _ __ | |_   _ _ __  _| |_ ___ _ __ 
 | |  | | '_ \\ / _ \\ '_ \\| | | | | '_ \\| | __/ _ \\ '__|
 | |__| | |_) |  __/ | | | | |_| | |_) | | ||  __/ |   
  \\____/| .__/ \\___|_| |_|_|\\__,_| .__/|_|\\__\\___|_|   
        | |                      | |                   
        |_|                      |_|                   
`;

export function Banner() {
  return (
    <Box flexDirection="column" alignItems="center" marginBottom={1}>
      <Text color="orange">{JUPITER_ASCII}</Text>
      <Box borderStyle="single" borderColor="orange" paddingX={2} marginTop={0}>
        <Text bold> 🪐 OPEN JUPITER v0.1.0 </Text>
      </Box>
      <Box marginTop={1}>
        <Text dimColor italic>
          "Exploring the boundaries of local AI automation"
        </Text>
      </Box>
    </Box>
  );
}
