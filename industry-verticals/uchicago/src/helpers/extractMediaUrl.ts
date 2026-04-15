// Extracts the media URL from a Sitecore rendering parameter string
export function extractMediaUrl(param: string | undefined): string | undefined {
  if (!param) {
    return undefined;
  }
  let decoded = param;
  try {
    decoded = decodeURIComponent(param);
  } catch {
    decoded = param;
  }
  if (/gridwell/i.test(decoded)) {
    return undefined;
  }
  const mediaUrlPattern = /mediaurl="([^"]*)"/i;
  if (mediaUrlPattern.test(decoded)) {
    return decoded.match(mediaUrlPattern)?.[1] || '';
  }
  const srcPattern = /\bsrc="([^"]+)"/i;
  const srcMatch = decoded.match(srcPattern);
  if (srcMatch?.[1]) {
    return srcMatch[1];
  }
  return undefined;
}
