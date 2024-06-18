// import {} from 'react'
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LoginSheet } from "@/components";

export function Header() {
  return (
    <div className="flex min-w-full items-center justify-between border-b-[1px] border-[hsl(var(--border))] px-12 py-4">
      <h1 className="text-lg font-bold text-pink-600 dark:text-pink-400">
        Louvores IBC/JUBAC
      </h1>

      <div className="flex items-center gap-4">
        <LoginSheet />
        <ThemeToggle />
      </div>
    </div>
  );
}
