"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background text-muted-foreground">
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <button
      onClick={cycleTheme}
      className="group relative flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-background/50 text-muted-foreground backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-accent hover:text-foreground"
      title={`Current: ${theme} (click to change)`}
    >
      {resolvedTheme === "dark" ? (
        <Moon className="h-4 w-4 transition-transform group-hover:rotate-12" />
      ) : theme === "system" ? (
        <Monitor className="h-4 w-4 transition-transform group-hover:scale-110" />
      ) : (
        <Sun className="h-4 w-4 transition-transform group-hover:rotate-45" />
      )}
    </button>
  );
}
