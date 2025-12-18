/**
 * Dashboard Layout
 * 
 * Protected layout for all dashboard pages.
 * Requires authentication and admin email whitelist.
 */

import { redirect } from "next/navigation";

import { Sidebar, Header } from "@/components/layout";
import { getSession, getAuthUser } from "@/lib/auth/server";
import { isAdmin } from "@/lib/auth/admin";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const user = getAuthUser(session);

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/login");
  }

  // Double-check admin status
  if (!isAdmin(user.email)) {
    redirect("/login?error=not_admin");
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64 flex flex-col min-h-screen">
        <Header
          user={{ name: user.name, email: user.email, image: user.image }}
          breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }]}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
