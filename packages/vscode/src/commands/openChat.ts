import * as vscode from 'vscode';
import { OpenDevWebviewProvider } from '../webview/provider.js';

export function registerCommands(context: vscode.ExtensionContext, provider: OpenDevWebviewProvider) {
  context.subscriptions.push(
    vscode.commands.registerCommand('opendev.openChat', () => {
      vscode.commands.executeCommand('opendev.chatView.focus');
    }),

    vscode.commands.registerCommand('opendev.explainCode', () => {
      vscode.commands.executeCommand('opendev.chatView.focus');
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const selection = editor.selection;
        const text = editor.document.getText(selection);
        if (text) {
          // Send context to the chat view
          provider.postMessage({ type: 'sendMessage', value: `Explain this code:\n\n\`\`\`\n${text}\n\`\`\`` });
        } else {
          vscode.window.showInformationMessage('No code selected to explain.');
        }
      }
    })
  );
}
