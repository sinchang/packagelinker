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
        axios.get(`https://api.npms.io/v2/search?q=${text}`)
            .then(function (res) {
                if (!res.data.results.length) {
                    vscode.window.showInformationMessage('Not Found');
                    return;
                }
                var urls = res.data.results[0].package.links;
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