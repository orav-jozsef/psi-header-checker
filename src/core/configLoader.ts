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

export interface PsiHeaderConfig {
  isActive: boolean;
  include: string[];
  includeGlob: string[];
  exclude: string[];
  excludeGlob: string[];
  autoHeader: string;
  enforceHeader: boolean;
  updateLicenseVariables: boolean;
}

export interface PsiHeaderLicenseReference {
  uri: string;
  uriIsLocalFile: boolean;
}

export interface PsiHeaderSettings {
  'psi-header.changes-tracking': PsiHeaderConfig;
  'psi-header.license-reference': PsiHeaderLicenseReference;
}

export interface ExtensionConfig {
  sourceFolder: string;
  blacklistExtensions: string[];
}

export interface LoadedConfig {
  extensionConfig: ExtensionConfig | null;
  psiHeaderConfig: PsiHeaderConfig | null;
  licenseReference: PsiHeaderLicenseReference | null;
}

export async function loadConfigs(): Promise<LoadedConfig> {
  const extensionConfig = loadExtensionConfig();
  if (!extensionConfig) {
    logger.error('Psi Header Checker configuration not found or incorrect!');
    vscode.window.showErrorMessage('Psi Header Checker configuration not found or incorrect!');
    return {
      extensionConfig: null,
      psiHeaderConfig: null,
      licenseReference: null
    }
  }
  logger.info(`Psi Header Checker configuration loaded: ${JSON.stringify(extensionConfig)}`);

  const psiHeaderConfig = loadPsiHeaderConfig();
  if (!psiHeaderConfig) {
    logger.error('Psi Header settings not found or incorrect!');
    vscode.window.showErrorMessage('Psi Header settings not found or incorrect!');
    return {
      extensionConfig: extensionConfig,
      psiHeaderConfig: null,
      licenseReference: null
    }
  }
  logger.info(`Psi Header settings loaded: ${JSON.stringify(psiHeaderConfig)}`);

  const licenseReference = loadPsiHeaderLicenseReference();
  if (!licenseReference) {
    logger.error('Psi Header license reference not found or incorrect!');
    vscode.window.showErrorMessage('Psi Header license reference not found or incorrect!');
    return {
      extensionConfig: extensionConfig,
      psiHeaderConfig: psiHeaderConfig,
      licenseReference: null
    }
  }
  logger.info(`Psi Header license reference loaded: ${JSON.stringify(licenseReference)}`);

  return {
    extensionConfig: extensionConfig,
    psiHeaderConfig: psiHeaderConfig,
    licenseReference: licenseReference
  }
}

function loadExtensionConfig(): ExtensionConfig | null {
  const config = vscode.workspace.getConfiguration('psi-header-checker');
  if (!config) {
    return null;
  }

  const sourceFolder = config.get<string>('sourceFolder');
  const blacklistExtensions = config.get<string[]>('blacklistExtensions');

  if (!sourceFolder || !blacklistExtensions) {
    return null;
  }

  return {
    sourceFolder: sourceFolder,
    blacklistExtensions: blacklistExtensions
  }
}

function loadPsiHeaderConfig(): PsiHeaderConfig | null {
  const config = vscode.workspace.getConfiguration();
  const psiHeaderConfig = config.get<PsiHeaderConfig>('psi-header.changes-tracking');
  if (!psiHeaderConfig) {
    return null;
  }
  return psiHeaderConfig;
}

function loadPsiHeaderLicenseReference(): PsiHeaderLicenseReference | null {
  const config = vscode.workspace.getConfiguration();
  const licenseReference = config.get<PsiHeaderLicenseReference>('psi-header.license-reference');
  if (!licenseReference) {
    return null;
  }
  return licenseReference;
}