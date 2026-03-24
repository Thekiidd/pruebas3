/** @jsxRuntime classic */
/** @jsx React.createElement */
import React, { useState, useEffect } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import { Banner } from './Banner.js';
import fs from 'node:fs';
import path from 'node:path';

const PROVIDERS = [
  { label: 'OpenRouter (Recommended - Free)', key: 'OPENROUTER_API_KEY' },
  { label: 'Anthropic (Claude)', key: 'ANTHROPIC_API_KEY' },
  { label: 'OpenAI (GPT-4)', key: 'OPENAI_API_KEY' },
  { label: 'Google (Gemini)', key: 'GEMINI_API_KEY' },
];

export function LaunchView() {
  const { exit } = useApp();
  const [step, setStep] = useState<'security' | 'provider' | 'key' | 'brain' | 'done'>('security');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [apiKey, setApiKey] = useState('');
  const [isError, setIsError] = useState(false);

  useInput((input, key) => {
    if (key.ctrl && input === 'c') exit();

    if (step === 'security') {
      if (input.toLowerCase() === 'y' || key.return) setStep('provider');
      if (input.toLowerCase() === 'n') exit();
    } 
    
    else if (step === 'provider') {
      if (key.upArrow) setSelectedIndex(Math.max(0, selectedIndex - 1));
      if (key.downArrow) setSelectedIndex(Math.min(PROVIDERS.length - 1, selectedIndex + 1));
      if (key.return) setStep('key');
    }

    else if (step === 'key') {
      if (key.return) {
        if (apiKey.length < 5) {
          setIsError(true);
        } else {
          saveKeyAndContinue();
        }
      } else if (key.backspace || key.delete) {
        setApiKey(prev => prev.slice(0, -1));
      } else if (input.length === 1) {
        setApiKey(prev => prev + input);
        setIsError(false);
      }
    }

    else if (step === 'done') {
      if (key.return) exit();
    }
  });

  const saveKeyAndContinue = async () => {
    try {
      const { secrets } = await import('@opendev/core');
      const provider = PROVIDERS[selectedIndex];
      if (!provider) return;
      secrets.set(provider.key, apiKey);
      setStep('brain');
    } catch (e: any) {
      console.error('❌ Failed to save key:', e);
      setIsError(true);
    }
  };

  useEffect(() => {
    if (step === 'brain') {
      initializeBrain().then(() => setStep('done'));
    }
  }, [step]);

  const initializeBrain = async () => {
    const configDir = path.join(process.cwd(), '.openjupiter');
    const cerebroPath = path.join(configDir, 'cerebro.md');
    const skillsDir = path.join(process.cwd(), 'skills');

    if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
    if (!fs.existsSync(skillsDir)) fs.mkdirSync(skillsDir, { recursive: true });

    const cerebroContent = `# 🪐 OpenJupiter Brain (Cerebro)
Este archivo define la identidad y el comportamiento de tu agente en este espacio de trabajo.

## Identidad
Eres un Ingeniero de Software Senior autónomo con acceso a herramientas locales.

## Reglas de Oro
1. Prioriza la seguridad: No borres archivos sin confirmar.
2. Sé conciso: Respuestas directas y técnicas.
3. Explora: Usa las herramientas de análisis de código para entender el contexto.

## Skills Disponibles
- ./skills/*
`;

    if (!fs.existsSync(cerebroPath)) {
      fs.writeFileSync(cerebroPath, cerebroContent, 'utf8');
    }
    
    // Create example skill
    const exampleSkill = path.join(skillsDir, 'hello.js');
    if (!fs.existsSync(exampleSkill)) {
      fs.writeFileSync(exampleSkill, 'console.log("Hello from Jupiter Skills!");', 'utf8');
    }
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Banner />

      {step === 'security' && (
        <Box flexDirection="column" borderStyle="double" borderColor="yellow" padding={1} marginTop={1}>
          <Text bold color="yellow"> ⚠️  SECURITY BASELINE </Text>
          <Box marginTop={1}>
            <Text>
              OpenJupiter will have full access to this directory: {process.cwd()}
            </Text>
          </Box>
          <Box marginTop={1}>
            <Text dimColor>• Tools enabled: Shell, Filesystem, Git, WebSearch.</Text>
            <Text dimColor>• Privileges: Matches your terminal user ({process.env.USERNAME || 'user'}).</Text>
          </Box>
          <Box marginTop={1} justifyContent="center">
            <Text>Accept security baseline? </Text>
            <Text bold color="green">(Y/n)</Text>
          </Box>
        </Box>
      )}

      {step === 'provider' && (
        <Box flexDirection="column" marginTop={1}>
          <Text bold color="orange">Step 1: Select AI Provider</Text>
          <Box flexDirection="column" marginTop={1} marginLeft={2}>
            {PROVIDERS.map((p, i) => (
              <Box key={p.key}>
                <Text color={i === selectedIndex ? 'cyan' : 'gray'}>
                  {i === selectedIndex ? ' ❯ ' : '   '}
                  {p.label}
                </Text>
              </Box>
            ))}
          </Box>
          <Box marginTop={1}>
            <Text dimColor>(Use ↑↓ Arrows and Enter to select)</Text>
          </Box>
        </Box>
      )}

      {step === 'key' && (
        <Box flexDirection="column" marginTop={1}>
          <Text bold color="orange">Step 2: Enter API Key for {PROVIDERS[selectedIndex]?.label || 'Provider'}</Text>
          <Box borderStyle="single" borderColor={isError ? 'red' : 'cyan'} paddingX={1} marginTop={1}>
             <Text>{apiKey.length > 0 ? '*'.repeat(apiKey.length) : 'Type here...'}</Text>
          </Box>
          {isError && <Text color="red">API Key too short or invalid. Please try again.</Text>}
          <Box marginTop={1}>
            <Text dimColor>(Press Enter to save, Ctrl+C to exit)</Text>
          </Box>
        </Box>
      )}

      {step === 'brain' && (
        <Box flexDirection="column" marginTop={1} alignItems="center">
          <Text color="cyan">Initializing Brain (cerebro.md)...</Text>
          <Box marginTop={1}>
            <Text dimColor italic>Mapping local neural pathways...</Text>
          </Box>
        </Box>
      )}

      {step === 'done' && (
        <Box flexDirection="column" borderStyle="round" borderColor="green" padding={1} marginTop={1} alignItems="center">
          <Text bold color="green">✨ OPEN JUPITER LAUNCHED SUCCESSFULLY ✨</Text>
          <Box marginTop={1}>
            <Text>• Config saved: <Text dimColor>~/.openjupiter/config.json</Text></Text>
          </Box>
          <Box>
            <Text>• Brain initialized: <Text dimColor>.openjupiter/cerebro.md</Text></Text>
          </Box>
          <Box>
            <Text>• Workspace: <Text dimColor>Ready at {process.cwd()}</Text></Text>
          </Box>
          <Box marginTop={1}>
            <Text>Now run: <Text bold color="orange">openjupiter chat</Text></Text>
          </Box>
          <Box marginTop={1}>
            <Text dimColor>(Press Enter to exit the launcher)</Text>
          </Box>
        </Box>
      )}
    </Box>
  );
}
