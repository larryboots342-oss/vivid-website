/**
 * Lightweight user-agent parser — no external deps.
 * Returns { device, browser, os } strings.
 */

export function parseUserAgent(ua: string | null) {
  if (!ua) return { device: "Unknown", browser: "Unknown", os: "Unknown" };

  const uaLower = ua.toLowerCase();

  // Device
  let device = "Desktop";
  if (/mobile|android|iphone|ipad|ipod/.test(uaLower)) {
    device = /ipad/.test(uaLower) ? "Tablet" : "Mobile";
  }

  // OS
  let os = "Unknown";
  if (/windows nt 10/.test(uaLower)) os = "Windows 10/11";
  else if (/windows nt 6.3/.test(uaLower)) os = "Windows 8.1";
  else if (/windows nt 6.2/.test(uaLower)) os = "Windows 8";
  else if (/windows nt 6.1/.test(uaLower)) os = "Windows 7";
  else if (/macintosh|mac os x/.test(uaLower)) os = "macOS";
  else if (/linux/.test(uaLower)) os = "Linux";
  else if (/android/.test(uaLower)) os = "Android";
  else if (/iphone|ipad|ipod/.test(uaLower)) os = "iOS";

  // Browser
  let browser = "Unknown";
  if (/edg/.test(uaLower)) browser = "Edge";
  else if (/opr|opera/.test(uaLower)) browser = "Opera";
  else if (/brave/.test(uaLower)) browser = "Brave";
  else if (/firefox/.test(uaLower)) browser = "Firefox";
  else if (/safari/.test(uaLower) && !/chrome|chromium/.test(uaLower)) browser = "Safari";
  else if (/chrome|chromium/.test(uaLower)) browser = "Chrome";

  return { device, browser, os };
}
