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
import { loadLicenseFile } from '../core/licenseLoader';
import { loadConfigs } from '../core/configLoader';
import { scanFiles } from '../core/fileScanner';
import { checkAndFixHeaders } from '../core/headerChecker';

export async function runCheckHeadersCommand() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showErrorMessage('No workspace folder is open. Please open a folder to run the header check.');
    return;
  }

  await vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: 'PSI Header Check in progress ...',
    cancellable: true,
  }, async (progress, token) => {
    logger.clear();
    logger.info('Starting PSI Header Check...');

    try {
      const configs = await loadConfigs();

      if (!configs.extensionConfig || !configs.psiHeaderConfig || !configs.licenseReference) {
        logger.error('Failed to load configuration files.');
        vscode.window.showErrorMessage('Failed to load configuration files. Please ensure they exist and are valid.');
        return;
      }

      const licenseLines = await loadLicenseFile(configs.licenseReference.uri, configs.licenseReference.uriIsLocalFile);
      if (!licenseLines) {
        logger.error('Failed to load license file.');
        vscode.window.showErrorMessage('Failed to load license file. Please ensure it exists and is valid.');
        return;
      }

      const allFiles = await scanFiles({
        sourceFolder: configs.extensionConfig.sourceFolder,
        excludeFileTypes: configs.extensionConfig.blacklistExtensions,
        psiHeaderInclude: configs.psiHeaderConfig.include,
        psiHeaderExclude: configs.psiHeaderConfig.exclude,
        psiHeaderExcludeGlob: configs.psiHeaderConfig.excludeGlob,
      });
      progress.report({ message: `${allFiles.length} file processing in progress...` });

      const results = await checkAndFixHeaders(allFiles, licenseLines);
      
      const fixedCount = results.filter(result => result.fixed).length;
      const skippedCount = results.length - fixedCount;

      vscode.window.showInformationMessage(`PSI Header Check completed! Fixed: ${fixedCount}, Skipped: ${skippedCount}`);
      logger.info(`PSI Header Check completed! Fixed: ${fixedCount}, Skipped: ${skippedCount}`);

      for (const res of results) {
        if (res.fixed) {
          logger.info(`Fixed header in file: ${res.filePath}`);
        } else if (res.error) {
          logger.error(`Error in file: ${res.filePath} - ${res.error}`);
        } else {
          logger.warn(`Skipped file: ${res.filePath}`);
        }
      }
    } catch (error: any) {
      logger.error(`Error during PSI Header Check: ${error.message}`);
      vscode.window.showErrorMessage(`Error during PSI Header Check: ${error.message}`);
    }
  });
}