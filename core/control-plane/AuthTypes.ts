// Auth removed - stub types for compatibility
export type ControlPlaneSessionInfo = null;
export type AuthType = never;

export function isOnPremSession(_session: any): boolean {
  return false;
}
