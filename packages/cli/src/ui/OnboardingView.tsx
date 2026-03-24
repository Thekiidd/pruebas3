/** @jsxRuntime classic */
/** @jsx React.createElement */
import React, { useState } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import { Banner } from './Banner.js';

export function OnboardingView() {
  const { exit } = useApp();
  const [step, setStep] = useState(0);

  useInput((input, key) => {
    if (key.ctrl && input === 'c') exit();
    if (key.return || input.toLowerCase() === 'y') {
       if (step === 0) setStep(1);
       else if (step === 1) exit();
    }
    if (input.toLowerCase() === 'n' && step === 0) exit();
  });

  return (
    <Box flexDirection="column" padding={1}>
      <Banner />
      
      {step === 0 && (
        <Box flexDirection="column" borderStyle="round" borderColor="yellow" padding={1} marginTop={1}>
          <Text bold color="yellow"> ⚠️  SECURITY WARNING — PLEASE READ </Text>
          <Box marginTop={1}>
            <Text>
              OpenJupiter is a powerful AI agent. It can read files and run terminal commands.
              By default, it operates with your local user permissions.
            </Text>
          </Box>
          <Box marginTop={1}>
            <Text color="gray">
              • Never run it on sensitive production data without monitoring.
              • Be careful with tools that have write access.
              • Keep your API secrets out of the reachable filesystem.
            </Text>
          </Box>
          <Box marginTop={1}>
            <Text>I understand and want to continue? </Text>
            <Text bold color="green">(Y/n)</Text>
          </Box>
        </Box>
      )}

      {step === 1 && (
        <Box flexDirection="column" marginTop={1}>
          <Text bold color="green">✅ Security context accepted.</Text>
          <Box marginTop={1}>
            <Text>Next step: Configuration.</Text>
          </Box>
          <Text dimColor>To start using OpenJupiter, please set your OpenRouter API Key:</Text>
          <Box borderStyle="single" paddingX={1} marginTop={1}>
            <Text color="cyan">openjupiter config set OPENROUTER_API_KEY {"<your_key>"}</Text>
          </Box>
          <Box marginTop={1}>
             <Text>Once configured, run: <Text bold color="orange">openjupiter chat</Text></Text>
          </Box>
          <Box marginTop={1}>
             <Text dimColor>(Press Enter to exit the wizard)</Text>
          </Box>
        </Box>
      )}
    </Box>
  );
}
