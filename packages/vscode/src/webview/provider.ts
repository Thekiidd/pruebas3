import * as vscode from 'vscode';
import { AgentOrchestrator, StreamChunk } from '@opendev/core';
import { getWorkspaceFolder } from '../utils/workspace.js';

export class OpenDevWebviewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'opendev.chatView';
  private _view?: vscode.WebviewView;
  private agent?: AgentOrchestrator;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;
    webviewView.webview.options = { enableScripts: true };

    // Simply use basic HTML UI for demo; production would load a compiled React/Vite app.
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case 'sendMessage':
          await this._handleMessage(data.value);
          break;
      }
    });
  }

  public postMessage(message: any) {
    this._view?.webview.postMessage(message);
  }

  private async _handleMessage(text: string) {
    if (!this.agent) {
      const workdir = getWorkspaceFolder() || process.cwd();
      this.agent = new AgentOrchestrator({ workdir });
    }

    try {
      this.postMessage({ type: 'stream-start' });
      for await (const chunk of this.agent.run(text)) {
        this.postMessage({ type: 'stream-chunk', value: chunk });
      }
      this.postMessage({ type: 'stream-done' });
    } catch (e) {
      this.postMessage({ type: 'error', value: String(e) });
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: var(--vscode-font-family); padding: 10px; color: var(--vscode-foreground); }
    #chat { height: calc(100vh - 80px); overflow-y: auto; margin-bottom: 10px; display: flex; flex-direction: column; gap: 8px; }
    #input-container { display: flex; gap: 4px; }
    input { flex: 1; padding: 6px; background: var(--vscode-input-background); color: var(--vscode-input-foreground); border: 1px solid var(--vscode-input-border); }
    button { padding: 6px 12px; background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; cursor: pointer; }
    .msg { padding: 8px; border-radius: 4px; background: var(--vscode-editor-inactiveSelectionBackground); }
    .msg-user { border-left: 3px solid var(--vscode-activityBarBadge-background); }
    .msg-agent { border-left: 3px solid var(--vscode-terminal-ansiCyan); }
  </style>
</head>
<body>
  <div id="chat"></div>
  <div id="input-container">
    <input type="text" id="input" placeholder="Ask OpenDev to code...">
    <button id="send">Send</button>
  </div>
  <script>
    const vscode = acquireVsCodeApi();
    const chat = document.getElementById('chat');
    const input = document.getElementById('input');
    const btn = document.getElementById('send');
    let currentAgentMessage = null;

    btn.addEventListener('click', () => {
      const text = input.value;
      if (!text) return;
      chat.innerHTML += '<div class="msg msg-user"><b>You:</b> ' + text + '</div>';
      vscode.postMessage({ type: 'sendMessage', value: text });
      input.value = '';
    });

    window.addEventListener('message', event => {
      const msg = event.data;
      if (msg.type === 'stream-start') {
        currentAgentMessage = document.createElement('div');
        currentAgentMessage.className = 'msg msg-agent';
        currentAgentMessage.innerHTML = '<b>OpenDev:</b> <span class="content"></span>';
        chat.appendChild(currentAgentMessage);
      } else if (msg.type === 'stream-chunk') {
        if (msg.value.type === 'text' && currentAgentMessage) {
          const c = currentAgentMessage.querySelector('.content');
          c.innerText += msg.value.content;
          chat.scrollTop = chat.scrollHeight;
        } else if (msg.value.type === 'tool_call' && currentAgentMessage) {
          const c = currentAgentMessage.querySelector('.content');
          c.innerHTML += '<br/><i>[Running ' + msg.value.toolName + ']</i><br/>';
          chat.scrollTop = chat.scrollHeight;
        }
      }
    });
  </script>
</body>
</html>`;
  }
}
