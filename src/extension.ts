'use strict'

import * as vscode from 'vscode'
import axios from 'axios'
const opn = require('opn')

const fileTypes = [
  {
    fileName: 'package.json',
    suffixs: ['ts', 'tsx', 'js', 'html', 'css', 'less', 'sass', 'scss'],
    registry: 'npm'
  },
  {
    fileName: 'requirements.txt',
    suffixs: ['py'],
    registry: 'pypi'
  },
  {
    fileName: 'composer.json',
    suffixs: ['php'],
    registry: 'composer'
  },
  {
    fileName: 'Gemfile',
    suffixs: ['rb'],
    registry: 'rubygems'
  }
]

function getFileExtension(filename) {
  return filename.split('.').pop()
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'extension.goToGitHub',
    () => {
      const editor = vscode.window.activeTextEditor

      if (!editor) {
        return
      }

      const selection = editor.selection
      const text = editor.document.getText(selection)
      const currentlyOpenTabfilePath = editor.document.fileName
      let split = currentlyOpenTabfilePath.split('/')
      if (split[0] === currentlyOpenTabfilePath)
        // Windows
        split = currentlyOpenTabfilePath.split('\\')
      const currentFileName = split[split.length - 1]
      const suffix = getFileExtension(currentFileName)

      let registry = ''

      fileTypes.forEach(item => {
        if (
          item.fileName === currentFileName ||
          item.suffixs.includes(suffix)
        ) {
          registry = item.registry
        }
      })

      if (!registry || !text) return

      axios
        .get(`https://octolinker-api.now.sh?${registry}=${text}`)
        .then(res => {
          if (res.data.result && res.data.result.length > 0) {
            opn(res.data.result[0].result)
          }
        })
        .catch(error => vscode.window.showInformationMessage(error.message))
    }
  )

  context.subscriptions.push(disposable)
}

export function deactivate() {}
