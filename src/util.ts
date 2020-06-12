import { join, normalize } from 'path';
import { readFileSync, writeFileSync } from 'fs';

export function getTarget(root: string, angularJsonPath: string) {
    const angularJSON = getAngularJSON(angularJsonPath);
    const partialKey = Object.keys(angularJSON.projects).find((k) => {
        if (normalize(angularJSON.projects[k].root) === normalize(root)) {
            return true;
        }
    });
    return partialKey;
}

export function getPartial(root: string, angularJsonPath: string) {
    const angularJSON = getAngularJSON(angularJsonPath);
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

export function getAngularJSON(angularJsonPath: string) {
    const angularJSON = JSON.parse(readFileSync(angularJsonPath, { encoding: 'utf-8' }));
    return angularJSON;
}

export function writeAngularJSON(angularJSON: any, angularJsonPath: string) {
    writeFileSync(angularJsonPath, JSON.stringify(angularJSON, null, 4));
}
