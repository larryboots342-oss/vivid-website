"use client";

import { ReactNode } from "react";

export default function DashboardLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  // No page transition wrapper in dev — instant navigation
  return <>{children}</>;
}
