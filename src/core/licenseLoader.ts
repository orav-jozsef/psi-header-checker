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