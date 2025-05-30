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
import { logger } from '../utils/logger';

export async function ensureExtensionActive(extensionId: string): Promise<boolean> {
  const psiExtension = vscode.extensions.getExtension(extensionId);
  if (!psiExtension) {
    logger.error(`PSI Extension (${extensionId}) is not installed.`);
    vscode.window.showErrorMessage(`PSI Extension is not installed. Please install the extension to run the header check.`);
    return false;
  }

  if (!psiExtension.isActive) {
    try {
      await psiExtension.activate();
      logger.info(`PSI Extension (${extensionId}) activated successfully.`);
      vscode.window.showInformationMessage(`PSI Extension (${extensionId}) activated successfully.`);
      return true;
    } catch (error) {
      logger.error(`Failed to activate PSI Extension: ${error}`);
      vscode.window.showErrorMessage(`Failed to activate PSI Extension: ${error}`);
      return false;
    }
  } else {
    logger.info(`PSI Extension (${extensionId}) is already active.`);
    vscode.window.showInformationMessage(`PSI Extension (${extensionId}) is already active.`);
    return true;
  }
}