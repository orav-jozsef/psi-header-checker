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