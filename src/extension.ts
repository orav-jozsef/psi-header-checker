import * as vscode from 'vscode';
import { logger } from './utils/logger';
import { runCheckHeadersCommand } from './commands/checkHeaders';

export function activate(context: vscode.ExtensionContext) {
	console.log('PSI Header Guardian extension is now active.');
	logger.info('PSI Header Guardian extension is now active.');

	let disposable = vscode.commands.registerCommand('psi-header-guardian.checkHeaders', async () => {
		try {
			await runCheckHeadersCommand();
		} catch (error: any) {
			vscode.window.showErrorMessage('Error running header check: ' + error.message);
			logger.error('Error running header check: ' + error.message);
		}
  });

	context.subscriptions.push(disposable);
}

export function deactivate() {
	console.log('PSI Header Guardian extension is now deactivated.');
	logger.info('PSI Header Guardian extension is now deactivated.');
}
