/**
 * Detects whether the application is running in the developer's private active workspace
 * (which includes local dev server at localhost or the AI Studio development container ending with -dev-).
 */
export function isDevelopmentWorkspace(): boolean {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  return (
    hostname.includes('-dev-') ||
    hostname.includes('localhost') ||
    hostname.includes('127.0.0.1')
  );
}
