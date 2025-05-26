/*
 * <<licensetext>>
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