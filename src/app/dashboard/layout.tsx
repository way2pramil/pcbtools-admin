import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

// TODO: Replace with actual auth when NextAuth is configured
const mockUser = {
  name: "Pramil",
  email: "pramil.wakchaure@gmail.com",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header userName={mockUser.name} userEmail={mockUser.email} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
