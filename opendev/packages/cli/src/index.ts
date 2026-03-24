#!/usr/bin/env node
import { Command } from 'commander';

process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 Unhandled Rejection at:', promise, 'reason:', reason);
});

const program = new Command()
  .name('openjupiter')
  .version('0.1.0')
  .description('🪐 OpenJupiter — Autonomous AI coding agent and global CLI');

program
  .command('start')
  .description('Launch OpenJupiter: Start the server and open the web chat')
  .option('-p, --port <number>', 'Port to run the server on', '3000')
  .action(async (options) => {
    const { buildApp } = await import('@opendev/server/app');
    const path = await import('node:path');
    const { fileURLToPath } = await import('node:url');
    const open = (await import('open')).default;
    const fs = await import('node:fs');
    
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    
    // 1. Try local dev path (from monorepo root)
    let webDistPath = path.resolve(process.cwd(), 'packages/web/dist');
    
    // 2. Try relative to package (for global install)
    if (!fs.existsSync(webDistPath)) {
      webDistPath = path.resolve(__dirname, '..', '..', 'web', 'dist');
    }
    
    // 3. Try standard node_modules structure
    if (!fs.existsSync(webDistPath)) {
      webDistPath = path.resolve(__dirname, '..', 'node_modules', '@opendev', 'web', 'dist');
    }
    
    console.log('🚀 Launching OpenJupiter...');
    console.log(`📡 Server starting on http://localhost:${options.port}`);
    
    const app = await buildApp({ webDistPath });
    try {
      await app.listen({ port: parseInt(options.port, 10), host: '0.0.0.0' });
      console.log('✨ System online!');
      await open(`http://localhost:${options.port}`);
    } catch (err) {
      console.error('❌ Failed to start system:', err);
      process.exit(1);
    }
  });

program
  .command('chat')
  .description('Start interactive chat with the agent')
  .option('-m, --model <model>', 'Model to use', 'openrouter/google/gemini-flash-1.5-8b:free')
  .option('-d, --dir <dir>', 'Working directory', process.cwd())
  .action(async (opts: { model: string; dir: string }) => {
    const { render } = await import('ink');
    const React = (await import('react')).default;
    const { ChatView } = await import('./ui/ChatView.js');
    render(React.createElement(ChatView, { model: opts.model, workdir: opts.dir }));
  });

program
  .command('launch')
  .description('Start the OpenJupiter setup wizard (Launchpad)')
  .action(async () => {
    const { render } = await import('ink');
    const React = (await import('react')).default;
    const { LaunchView } = await import('./ui/LaunchView.js');
    render(React.createElement(LaunchView));
  });

program
  .command('onboard')
  .description('Alias for launch')
  .action(async () => {
    const { render } = await import('ink');
    const React = (await import('react')).default;
    const { LaunchView } = await import('./ui/LaunchView.js');
    render(React.createElement(LaunchView));
  });

program
  .command('run <task>')
  .description('Run a one-shot task')
  .option('-m, --model <model>', 'Model to use', 'openrouter/google/gemini-flash-1.5-8b:free')
  .option('-d, --dir <dir>', 'Working directory', process.cwd())
  .action(async (task: string, opts: { model: string; dir: string }) => {
    const { AgentOrchestrator } = await import('@opendev/core');
    const agent = new AgentOrchestrator({ modelId: opts.model, workdir: opts.dir });

    for await (const event of agent.run(task)) {
      if (event.type === 'text') process.stdout.write(event.content ?? '');
      if (event.type === 'tool_call') console.log(`\n🔧 ${event.toolName}(${JSON.stringify(event.toolArgs)})`);
      if (event.type === 'tool_result') console.log(`✅ ${event.toolResult}`);
      if (event.type === 'done') { console.log('\n\nDone!'); process.exit(0); }
      if (event.type === 'error') { console.error(`\nError: ${event.error}`); process.exit(1); }
    }
  });

program
  .command('models')
  .description('List available models')
  .action(async () => {
    const { modelRegistry } = await import('@opendev/core');
    const models = await modelRegistry.listAll();
    console.log('Available models:\n' + models.map(m => `  - ${m}`).join('\n'));
  });

program
  .command('config')
  .description('Manage global configuration and API keys')
  .argument('<action>', 'Action to perform (e.g., set)')
  .argument('<key>', 'The configuration key (e.g., OPENAI_API_KEY)')
  .argument('<value>', 'The value to set')
  .action(async (action: string, key: string, value: string) => {
    if (action === 'set') {
      const { secrets } = await import('@opendev/core');
      secrets.set(key, value);
      console.log(`✅ Saved ${key} to global configuration (~/.opendev/config.json)`);
    } else {
      console.error(`Unknown action ${action}. Use: config set <key> <value>`);
    }
  });

program
  .command('init')
  .description('Initialize OpenJupiter (alias for launch)')
  .action(() => {
    console.log('🚀 Redirecting to the Launchpad...');
    console.log('Run: openjupiter launch');
  });

program.parse();
