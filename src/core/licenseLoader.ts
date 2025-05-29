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
import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../utils/logger';

export async function loadLicenseFile(licensePath: string, isLocalFile: boolean): Promise<string[] | null> {
  try {
    let licenseContent: string;

    if (isLocalFile) {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders || workspaceFolders.length === 0) {
        logger.error('There is no workspace open, the license file cannot be loaded.');
        vscode.window.showErrorMessage('There is no workspace open, the license file cannot be loaded.');
        return null;
      }

      let licenseFilePath = licensePath;
      if (!path.isAbsolute(licensePath)) {
        licenseFilePath = path.join(workspaceFolders[0].uri.fsPath, licensePath.replace('../', ''));
      }

      if  (!fs.existsSync(licenseFilePath)) {
        logger.error(`License file not found: ${licenseFilePath}`);
        vscode.window.showErrorMessage(`License file not found: ${licenseFilePath}`);
        return null;
      }

      licenseContent = fs.readFileSync(licenseFilePath, 'utf8');
    } else {
      logger.error('License file is not a local file, cannot load it.');
      vscode.window.showErrorMessage('License file is not a local file, cannot load it.');
      return null;
    }

    licenseContent = licenseContent.replace(/\r\n/g, '\n');
    const licenseLines = licenseContent.split('\n').filter(line => line.length > 0);

    logger.info(`License file loaded, number of lines: ${licenseLines.length}`);
    return licenseLines;
  } catch (error) {
    logger.error(`Error loading license file: ${error}`);
    vscode.window.showErrorMessage(`Error loading license file: ${error}`);
    return null;
  }
}