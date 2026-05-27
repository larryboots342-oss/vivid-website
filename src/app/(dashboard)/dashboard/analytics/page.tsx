import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { isOwner } from "@/lib/owner";
import AnalyticsContent from "./analytics-content";

export default async function AnalyticsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const owner = await isOwner(userId);

  if (!owner) {
    redirect("/dashboard");
  }

  return <AnalyticsContent />;
}
