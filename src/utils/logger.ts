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