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

interface HeaderCheckResult {
  filePath: string;
  missingLines: string[];
  fixed: boolean;
  error?: string;
}

export async function checkAndFixHeaders(
  files: string[],
  licenseLines: string[]
): Promise<HeaderCheckResult[]> {
  const results: HeaderCheckResult[] = [];

  for (const filePath of files) {
    try {
      const uri = vscode.Uri.file(filePath);
      const doc = await vscode.workspace.openTextDocument(uri);
      const editor = await vscode.window.showTextDocument(doc, {
        preview: true,
      });


      const docText = doc.getText();
      const missingLines = licenseLines.filter((line) => !docText.includes(line));

      if (missingLines.length === 0) {
        results.push({
          filePath,
          missingLines: [],
          fixed: false,
        });
        continue;
      }

      await vscode.commands.executeCommand('psi-header.insertFileHeader');
      await editor.document.save();
      logger.info(`Header inserted for ${filePath}`);
      vscode.window.showInformationMessage(`Header inserted for ${filePath}`);
      results.push({
        filePath,
        missingLines,
        fixed: true,
      });
    } catch (error) {
      logger.error(`Error processing file ${filePath}: ${error}`);
      results.push({
        filePath,
        missingLines: [],
        fixed: false,
        error: `Error processing file ${filePath}: ${error}`,
      });
      vscode.window.showErrorMessage(`Error processing file ${filePath}: ${error}`);
    }
  }

  return results;
}