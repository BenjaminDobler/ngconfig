'use strict';

import * as vscode from 'vscode';
import { AngularJsonFS } from './fileSystemProvider';
import { relative, join, normalize } from 'path';
import { getTarget } from './util';
export function activate(context: vscode.ExtensionContext) {
    const angularJsonFS = new AngularJsonFS();
    context.subscriptions.push(
        vscode.workspace.registerFileSystemProvider('angularjson', angularJsonFS, {
            isCaseSensitive: true,
        })
    );

    vscode.commands.registerCommand('ngconfig.openProjectPartial', async (contextItem) => {
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(contextItem.fsPath));
        if(workspaceFolder) {
            const folderPath = contextItem.fsPath;
            const rel = relative(workspaceFolder.uri.fsPath, folderPath);
            const angularJsonPath = join(workspaceFolder.uri.fsPath, 'angular.json');
            const partialKey = getTarget(rel, angularJsonPath);
            if (partialKey) {
                const uri = vscode.Uri.file(partialKey + ' : angular.json').with({
                    scheme: 'angularjson',
                    query: rel,
                    fragment: angularJsonPath
                });
                const doc = await vscode.workspace.openTextDocument(uri);
                await vscode.window.showTextDocument(doc, { preview: false });
            } else {
                vscode.window.showWarningMessage('No angular project found for directory: ' + rel);
            }
        }
    });
}
