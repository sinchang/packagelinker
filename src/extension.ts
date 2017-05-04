'use strict';

import * as vscode from 'vscode';
import axios from 'axios';
const opn = require('opn');

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.goToGitHub', () => {
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        var selection = editor.selection;
        var text = editor.document.getText(selection);
        axios.get(`https://api.npms.io/v2/package/${text}`)
            .then(function (res) {
                if (res.data.code === 'NOT_FOUND') {
                    vscode.window.showInformationMessage('Module not found');
                    return;
                }
                var urls = res.data.collected.metadata.links;
                var url = urls.repository || urls.npm || urls.homepage;
                opn(url);
            })
            .catch(function (error) {
                vscode.window.showInformationMessage('Something Error, Please Try Again!');
            });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}