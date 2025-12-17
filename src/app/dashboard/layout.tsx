import { redirect } from "next/navigation";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
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
    <div className="flex h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header userName={profile.name} userEmail={profile.email} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
