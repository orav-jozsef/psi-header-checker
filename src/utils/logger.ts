import * as vscode from 'vscode';

class Logger {
  private outputChannel: vscode.OutputChannel;

  constructor(channelName: string = 'Psi Header Guardian') {
    this.outputChannel = vscode.window.createOutputChannel(channelName);
  }

  info(message: string): void {
    this.appendMessage('INFO', message);
  }

  warn(message: string) {
    this.appendMessage('WARN', message);
  }

  error(message: string) {
    this.appendMessage('ERROR', message);
  }

  // debug(message: string) {
  //   this.appendMessage('DEBUG', message);
  // }

  clear() {
    this.outputChannel.clear();
  }

  show(preserveFocus: boolean = false) {
    this.outputChannel.show(preserveFocus);
  }

  private appendMessage(level: string, message: string) {
    const timestamp = new Date().toISOString();
    this.outputChannel.appendLine(`[${timestamp}] [${level}] ${message}`);
  }
}

export const logger = new Logger();