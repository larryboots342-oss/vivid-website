import { redirect } from "next/navigation";
import { isOwner } from "@/lib/owner";
import AnalyticsContent from "./analytics-content";

export default async function AnalyticsPage() {
  const owner = await isOwner();

  if (!owner) {
    redirect("/dashboard");
  }

  return <AnalyticsContent />;
}
