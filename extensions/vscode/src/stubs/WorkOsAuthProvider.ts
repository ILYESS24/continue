// Auth removed - stubs for compatibility
import { ControlPlaneSessionInfo } from "core/control-plane/AuthTypes";
import * as vscode from "vscode";

export class WorkOsAuthProvider implements vscode.AuthenticationProvider {
  // Stub implementation - auth removed
  onDidChangeSessions =
    new vscode.EventEmitter<vscode.AuthenticationProviderAuthenticationSessionsChangeEvent>()
      .event;

  async getSessions(
    _scopes?: readonly string[],
  ): Promise<readonly vscode.AuthenticationSession[]> {
    return [];
  }

  async createSession(
    _scopes: readonly string[],
  ): Promise<vscode.AuthenticationSession> {
    throw new Error("Authentication not supported");
  }

  async removeSession(_sessionId: string): Promise<void> {
    // No-op
  }

  dispose(): void {
    // No-op
  }
}

export async function getControlPlaneSessionInfo(
  _silent: boolean = false,
  _useOnboarding: boolean = false,
): Promise<ControlPlaneSessionInfo> {
  return null;
}
