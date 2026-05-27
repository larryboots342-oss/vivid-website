import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { OWNER_EMAIL } from "@/lib/owner-email";
import AdminSidebar from "@/components/admin/sidebar";
import AdminHeader from "@/components/admin/header";
import PageTransition from "@/components/marketing/page-transition";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    redirect("/sign-in?redirect_url=/admin");
  }

  // Owner email bypass
  const clerkUser = await currentUser();
  const email = clerkUser?.primaryEmailAddress?.emailAddress;
  if (email === OWNER_EMAIL) {
    return (
      <div className="min-h-screen bg-vivid-bg">
        <AdminSidebar />
        <div className="lg:ml-72 min-h-screen">
          <AdminHeader />
          <main id="main-content" className="p-6 lg:p-8 pt-20 lg:pt-6 max-w-7xl">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>
    );
  }

  // Check admin role from DB
  const dbUser = await prisma.user.findUnique({
    where: { clerkId },
    select: { role: true },
  });

  const metadataRole =
    (clerkUser?.publicMetadata?.role as string) ||
    (clerkUser?.unsafeMetadata?.role as string);

  const isAdmin = dbUser?.role === "admin" || metadataRole === "admin";

  if (!isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-vivid-bg">
      <AdminSidebar />
      <div className="lg:ml-72 min-h-screen">
        <AdminHeader />
        <main id="main-content" className="p-6 lg:p-8 pt-20 lg:pt-6 max-w-7xl">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
