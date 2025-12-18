/**
 * Header Component
 * 
 * Top navigation bar with user info and sign out.
 */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Breadcrumb } from "./breadcrumb";
import { SignOutButton } from "./sign-out-button";

interface HeaderProps {
  user?: { name: string | null; email: string; image: string | null };
  breadcrumbs?: { label: string; href?: string }[];
}

export function Header({ user, breadcrumbs }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div>
        {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
      </div>
      {user && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:block">
            {user.name || user.email}
          </span>
          <Avatar className="h-8 w-8">
            {user.image && <AvatarImage src={user.image} alt={user.name || ""} />}
            <AvatarFallback>
              {(user.name || user.email).charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <SignOutButton />
        </div>
      )}
    </header>
  );
}
