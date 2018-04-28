'use strict'

import * as vscode from 'vscode'
import axios from 'axios'
const opn = require('opn')

const fileTypes = [{
  fileName: 'package.json',
  registry: 'npm'
}, {
  fileName: 'requirements.txt',
  registry: 'pypi'
}, {
  fileName: 'composer.json',
  registry: 'composer'
}, {
  fileName: 'Gemfile',
  registry: 'rubygems'
}]

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('extension.goToGitHub', () => {
    const editor = vscode.window.activeTextEditor

    if (!editor) {
      return
    }

    const selection = editor.selection
    const text = editor.document.getText(selection)
    const currentlyOpenTabfilePath = editor.document.fileName
    let split = currentlyOpenTabfilePath.split('/')
		if (split[0] === currentlyOpenTabfilePath) // Windows
			split = currentlyOpenTabfilePath.split('\\')
		const currentFileName = split[split.length - 1]

    let registry = ''

    fileTypes.forEach(item => {
      if (item.fileName === currentFileName) {
        registry = item.registry
      }
    })

    if (!registry || !text) return

    axios.get(`https://githublinker.herokuapp.com/q/${registry}/${text}`)
      .then(res => opn(res.data.url))
      .catch(error => vscode.window.showInformationMessage('Something Error, Please Try Again!'))
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {
}
