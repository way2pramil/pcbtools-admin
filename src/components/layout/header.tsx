/**
 * Header Component
 * 
 * Top navigation bar with user info, theme toggle, and sign out.
 */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Breadcrumb } from "./breadcrumb";
import { SignOutButton } from "./sign-out-button";
import { ThemeToggle } from "@/components/theme-toggle";

interface HeaderProps {
  user?: { name: string | null; email: string; image: string | null };
  breadcrumbs?: { label: string; href?: string }[];
}

export function Header({ user, breadcrumbs }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/40 bg-background/80 px-6 backdrop-blur-xl">
      <div>
        {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden flex-col items-end sm:flex">
              <span className="text-sm font-medium text-foreground">
                {user.name || "User"}
              </span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
            <Avatar className="h-9 w-9 ring-2 ring-border/50">
              {user.image && <AvatarImage src={user.image} alt={user.name || ""} />}
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {(user.name || user.email).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <SignOutButton />
          </div>
        )}
      </div>
    </header>
  );
}
