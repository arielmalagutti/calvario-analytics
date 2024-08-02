import { User as UserType } from "@supabase/supabase-js";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LoginSheet } from "@/components";
import { Link } from "react-router-dom";

type HeaderProps = {
  user: UserType;
};

const PAGES: { href: string; label: string }[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    href: "/worships",
    label: "Worships",
  },
  {
    href: "/musics",
    label: "Musics",
  },
];

export function Header({ user }: HeaderProps) {
  return (
    <div className="flex max-h-16 min-w-full items-center justify-between border-b-[1px] border-[hsl(var(--border))] px-12 py-4">
      <div className="flex items-center gap-11">
        <h1 className="inline-block bg-gradient-to-br from-pink-200 from-5% via-pink-400 to-pink-600 to-95% bg-clip-text text-2xl font-bold text-transparent">
          Louvores IBC/JUBAC
        </h1>

        <div className="flex gap-4 self-center">
          {PAGES.map((page) => (
            <Link
              key={page.label}
              to={page.href}
              className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-300"
            >
              {page.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user.id ? <p className="font-medium">LOGGED IN</p> : <LoginSheet />}
        <ThemeToggle />
      </div>
    </div>
  );
}
