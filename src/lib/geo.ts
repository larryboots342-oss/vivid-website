/**
 * Simple IP geolocation using ipapi.co (free tier, no key needed)
 * Falls back gracefully on any error.
 */
export async function getCountryFromIp(ip: string): Promise<string | null> {
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    return "Local Network";
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`https://ipapi.co/${ip}/country_name/`, {
      signal: controller.signal,
      headers: { "User-Agent": "VIVID-Admin/1.0" },
    });

    clearTimeout(timeout);

    if (!res.ok) return null;
    const text = (await res.text()).trim();
    return text || null;
  } catch {
    return null;
  }
}

interface GeoData {
  country: string | null;
  city: string | null;
  region: string | null;
}

export async function getGeoFromIP(ip: string): Promise<GeoData | null> {
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    return { country: "Local Network", city: "Local", region: "Local" };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`https://ipapi.co/${ip}/json/`, {
      signal: controller.signal,
      headers: { "User-Agent": "VIVID-Admin/1.0" },
    });

    clearTimeout(timeout);

    if (!res.ok) return null;
    const data = await res.json();
    return {
      country: data.country_name || null,
      city: data.city || null,
      region: data.region || null,
    };
  } catch {
    return null;
  }
}
