import { redirect } from "next/navigation";

import { Sidebar, Header } from "@/components/layout";
import { validateRequest, type AuthenticatedUser } from "@/lib/auth/lucia";
import { isAdmin } from "@/lib/auth/admin";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/login");
  }

  const profile = user as AuthenticatedUser;

  // Double-check admin status
  if (!isAdmin(profile.email)) {
    redirect("/login?error=not_admin");
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64 flex flex-col min-h-screen">
        <Header
          user={{ name: profile.name, email: profile.email ?? "", image: profile.avatarUrl }}
          breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }]}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
