function placeholderEntryCount(value: unknown): number {
  if (Array.isArray(value)) {
    return value.length;
  }
  if (value && typeof value === 'object' && ('componentName' in value || 'uid' in value)) {
    return 1;
  }
  return 0;
}

/**
 * Detects an empty headless-header so we can show a static shell in local dev when Edge/layout
 * returns no components (missing env, wrong site, or unpublished content).
 */
export function isHeadlessHeaderPlaceholderEmpty(route: unknown): boolean {
  if (!route || typeof route !== 'object') {
    return true;
  }
  const placeholders = (route as { placeholders?: Record<string, unknown> }).placeholders;
  if (!placeholders || typeof placeholders !== 'object') {
    return true;
  }
  return placeholderEntryCount(placeholders['headless-header']) === 0;
}

export function shouldShowUChicagoLocalChrome(route: unknown): boolean {
  const off =
    process.env.NEXT_PUBLIC_UCHICAGO_LOCAL_CHROME === 'false' ||
    process.env.NEXT_PUBLIC_UCHICAGO_LOCAL_CHROME === '0';
  if (off) {
    return false;
  }
  const enabled =
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_UCHICAGO_LOCAL_CHROME === 'true';
  return enabled && isHeadlessHeaderPlaceholderEmpty(route);
}
