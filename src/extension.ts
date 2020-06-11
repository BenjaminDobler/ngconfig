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
        const folderPath = contextItem.fsPath;
        const rel = relative(vscode.workspace.rootPath || '', folderPath);
        const partialKey = getTarget(rel);
        if (partialKey) {
            const uri = vscode.Uri.file(partialKey + '-angular.json').with({
                scheme: 'angularjson',
                query: rel,
            });
            const doc = await vscode.workspace.openTextDocument(uri);
            await vscode.window.showTextDocument(doc, { preview: false });
        } else {
            vscode.window.showWarningMessage('No angular project found for directory: ' + rel);
        }
    });
}
