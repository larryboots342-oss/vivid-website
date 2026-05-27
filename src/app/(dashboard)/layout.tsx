import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import DashboardSidebar from "@/components/dashboard/sidebar";
import DashboardHeader from "@/components/dashboard/header";
import { ApiProvider } from "@/lib/swr-config";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-[100dvh] bg-vivid-bg">
      <ApiProvider>
        <DashboardSidebar />
        <div className="lg:ml-72 min-h-[100dvh]">
          <DashboardHeader />
          <main id="main-content" className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-6 max-w-7xl">
            {children}
          </main>
        </div>
      </ApiProvider>
    </div>
  );
}
