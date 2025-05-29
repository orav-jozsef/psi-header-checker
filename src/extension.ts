/*
 * MIT License
 * 
 * Copyright (c) 2025 Oravecz József
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */

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
