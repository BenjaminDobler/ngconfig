import * as vscode from 'vscode';
import { getTarget, getAngularJSON, writeAngularJSON, getPartial } from './util';

export class AngularJsonFS implements vscode.FileSystemProvider {
    stat(uri: vscode.Uri): vscode.FileStat {
        return {
            type: vscode.FileType.File,
            ctime: Date.now(),
            mtime: Date.now(),
            size: 0,
        };
    }

    readDirectory(uri: vscode.Uri): [string, vscode.FileType][] {
        return [];
    }

    readFile(uri: vscode.Uri): Uint8Array {
        const targetPath = uri.query;
        const partial = getPartial(targetPath, uri.fragment);

        if (partial) {
            const file = Buffer.from(JSON.stringify(partial, null, 4));
            return file;
        }
        throw vscode.FileSystemError.FileNotFound();
    }

    writeFile(uri: vscode.Uri, content: Uint8Array, options: { create: boolean; overwrite: boolean }): void {
        const targetPath = uri.query;
        const partialKey = getTarget(targetPath, uri.fragment);
        const angularJSON = getAngularJSON(uri.fragment);

        if (partialKey) {
            angularJSON.projects[partialKey] = JSON.parse(content.toString());
            writeAngularJSON(angularJSON, uri.fragment);
        }
    }

    rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean }): void {}

    delete(uri: vscode.Uri): void {}

    createDirectory(uri: vscode.Uri): void {}

    private _emitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>();

    readonly onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]> = this._emitter.event;

    watch(_resource: vscode.Uri): vscode.Disposable {
        return new vscode.Disposable(() => {});
    }
}
