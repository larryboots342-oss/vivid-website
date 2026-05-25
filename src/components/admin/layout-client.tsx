"use client";

import dynamic from "next/dynamic";

const PageTransition = dynamic(
  () => import("@/components/marketing/page-transition"),
  { ssr: false }
);

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageTransition variant="subtle">{children}</PageTransition>;
}
