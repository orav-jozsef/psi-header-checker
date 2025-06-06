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
import * as path from 'path';
import * as fs from 'fs/promises';
import { logger } from '../utils/logger';
import { Dirent } from 'fs';

export interface FileScannerConfig {
  sourceFolder: string;
  excludeFileTypes: string[];
  psiHeaderInclude: string[];
  psiHeaderExclude: string[];
  psiHeaderExcludeGlob: string[];
}

function matchGlobPatterns(filePath: string, patterns: string[]): boolean {
  const normalizedFile = path.normalize(filePath);
  return patterns.some((pattern) => {
    const normalizedPattern = path.normalize(pattern);
    if (normalizedPattern.startsWith('*')) {
      return normalizedFile.endsWith(normalizedPattern.substring(1));
    } else if (normalizedPattern.endsWith('*')) {
      return normalizedFile.startsWith(normalizedPattern.slice(0, -1));
    } else {
      return normalizedFile.includes(normalizedPattern);
    }
  });
}

function getFileExtension(filePath: string): string {
  return path.extname(filePath).toLowerCase();
}

function getLanguageFromExtension(extension: string): string | null {
  switch (extension) {
    case '.ts':
      return 'typescript';
    case '.js':
      return 'javascript';
    case '.html':
      return 'html';
    case '.scss':
      return 'scss';
    case '.less':
      return 'less';
    case '.svg':
      return 'svg';
    case '.sh':
      return 'shellscript';
    case '.md':
      return 'markdown';
    case '.json':
      return 'json';
    case '.jsonc':
      return 'jsonc';
    case '.txt':
      return 'text';
    default:
      return null;
  }
}

export async function scanFiles(config: FileScannerConfig): Promise<string[]> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    logger.error('No workspace folders found.');
    vscode.window.showErrorMessage('No workspace folders found.');
    return [];
  }

  let spurcePath = config.sourceFolder;
  if (!path.isAbsolute(spurcePath)) {
    spurcePath = path.join(workspaceFolders[0].uri.fsPath, spurcePath);
  }

  const allFiles: string[] = [];

  async function scanDirectory(directory: string): Promise<void> {
    let entries: Dirent[] = [];

    try {
      entries = await fs.readdir(directory, { withFileTypes: true });
    } catch (error) {
      logger.error(`Error reading directory ${directory}: ${error}`);
      vscode.window.showErrorMessage(`Error reading directory ${directory}: ${error}`);
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        await scanDirectory(fullPath);
      } else if (entry.isFile()) {
        allFiles.push(fullPath);
      }
    }
  }

  await scanDirectory(spurcePath);

  logger.info(`Found ${allFiles.length} files in the source folder.`);

  let filtered = allFiles.filter((file) => {
    return !config.excludeFileTypes.includes(getFileExtension(file));
  });

  logger.info(`Files after your own exclude filter: ${filtered.length}`);

  filtered = filtered.filter((file) => !matchGlobPatterns(file, config.psiHeaderExcludeGlob));

  logger.info(`Files after psi-header exclude glob filtering: ${filtered.length}`);

  filtered = filtered.filter((file) => {
    const ext = getFileExtension(file);
    const lang = getLanguageFromExtension(ext);
    
    if (!lang || config.psiHeaderExclude.includes(lang) || !config.psiHeaderInclude.includes(lang)) {
      return false;
    }
    return true;
  });

  logger.info(`Files after psi-header include/exclude language filtering: ${filtered.length}`);
  return filtered;
}