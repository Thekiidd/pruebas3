import * as vscode from 'vscode';
import { OpenDevWebviewProvider } from './webview/provider.js';
import { registerCommands } from './commands/openChat.js';

export function activate(context: vscode.ExtensionContext) {
  console.log('OpenDev extension activated');

  const provider = new OpenDevWebviewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(OpenDevWebviewProvider.viewType, provider)
  );

  registerCommands(context, provider);
}

export function deactivate() {}
