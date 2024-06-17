// import {} from 'react'
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Header() {
  return (
    <div className="min-w-full flex items-center justify-between px-12 py-4">
      <h1 className="text-lg font-bold text-pink-600 dark:text-pink-400">
        Louvores IBC/JUBAC
      </h1>
      <ThemeToggle />
    </div>
  );
}
