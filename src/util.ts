import { join, normalize } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import * as vscode from 'vscode';

export function getTarget(root: string) {
    const angularJSON = getAngularJSON();
    const partialKey = Object.keys(angularJSON.projects).find((k) => {
        if (normalize(angularJSON.projects[k].root) === normalize(root)) {
            return true;
        }
    });
    return partialKey;
}

export function getPartial(root: string) {
    const angularJSON = getAngularJSON();
    const partialKey = Object.keys(angularJSON.projects).find((k) => {
        if (normalize(angularJSON.projects[k].root) === normalize(root)) {
            return true;
        }
    });
    if (partialKey) {
        return angularJSON.projects[partialKey];
    }
    return null;
}

export function getAngularJSON() {
    const angularJsonPath = join(vscode.workspace.rootPath || '', 'angular.json');
    const angularJSON = JSON.parse(readFileSync(angularJsonPath, { encoding: 'utf-8' }));
    return angularJSON;
}

export function writeAngularJSON(angularJSON: any) {
    const angularJsonPath = join(vscode.workspace.rootPath || '', 'angular.json');
    writeFileSync(angularJsonPath, JSON.stringify(angularJSON, null, 4));
}
