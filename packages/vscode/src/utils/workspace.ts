import * as vscode from 'vscode';

export function getWorkspaceFolder(): string | undefined {
  const folders = vscode.workspace.workspaceFolders;
  if (folders && folders.length > 0) {
    return folders[0]?.uri.fsPath;
  }
  return undefined;
}
