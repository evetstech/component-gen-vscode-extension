const vscode = require('vscode');
const Generator = require('./generator');
const getWorkspaceFolder = require('./utils/workspace-util');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const root = getWorkspaceFolder(vscode.workspace.workspaceFolders);
  const generator = new Generator(root, vscode.window);
  
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('componentgenerator.genFiles', function () {
		generator.execute();
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
