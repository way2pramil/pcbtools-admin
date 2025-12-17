"use client";

import { LayoutDashboard, Bug, Users, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Bug Reports", href: "/dashboard/bugs", icon: Bug },
  { name: "Users", href: "/dashboard/users", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r border-white/10 bg-slate-900/60">
      <div className="flex h-16 items-center border-b border-white/10 px-6">
        <h1 className="text-lg font-bold text-white">PCBtools Admin</h1>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
