"use client";

import { Moon, Sun } from "lucide-react";

// Stateless: the icon shown is driven purely by the `.dark` class via CSS, so
// there's no hydration mismatch. The click flips the class + persists it.
export function ThemeToggle() {
  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className="relative grid h-10 w-10 place-items-center rounded-full text-foreground transition-colors hover:bg-foreground/5"
    >
      <Sun
        size={18}
        className="absolute rotate-90 scale-50 opacity-0 transition-all duration-300 dark:rotate-0 dark:scale-100 dark:opacity-100"
      />
      <Moon
        size={18}
        className="absolute rotate-0 scale-100 opacity-100 transition-all duration-300 dark:-rotate-90 dark:scale-50 dark:opacity-0"
      />
    </button>
  );
}
