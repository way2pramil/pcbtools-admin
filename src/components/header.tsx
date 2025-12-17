"use client";

import { User } from "lucide-react";

type HeaderProps = {
  userName: string | null;
  userEmail: string | null;
};

export function Header({ userName, userEmail }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-slate-900/60 px-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Admin Dashboard</h2>
        <p className="text-xs text-slate-400">Manage pcbtools.xyz</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-white">{userName || "Admin"}</p>
          <p className="text-xs text-slate-400">{userEmail || "No email"}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
          <User className="h-5 w-5 text-emerald-400" />
        </div>
      </div>
    </header>
  );
}
