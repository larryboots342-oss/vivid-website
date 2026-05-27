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
    <div className="min-h-screen bg-vivid-bg">
      <ApiProvider>
        <DashboardSidebar />
        <div className="lg:ml-72 min-h-screen">
          <DashboardHeader />
          <main id="main-content" className="p-6 lg:p-8 pt-20 lg:pt-6 max-w-7xl">
            {children}
          </main>
        </div>
      </ApiProvider>
    </div>
  );
}
