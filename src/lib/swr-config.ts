"use client";

import { SWRConfig } from "swr";

export const swrConfig = {
  refreshInterval: 30000,
  revalidateOnFocus: false,
  errorRetryCount: 3,
  fetcher: (url: string) => fetch(url).then((r) => r.json()),
};

export function ApiProvider({ children }: { children: React.ReactNode }) {
  return <SWRConfig value={swrConfig}>{children}</SWRConfig>;
}
