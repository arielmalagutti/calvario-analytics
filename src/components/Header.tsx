import { User as UserType } from "@supabase/supabase-js";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LoginSheet } from "@/components";
import { Link } from "react-router-dom";
import { useState } from "react";

import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

type HeaderProps = {
  user: UserType;
};

const PAGES: { href: string; label: string }[] = [
  {
    href: "/dashboard",
    label: "DASHBOARD",
  },
  {
    href: "/worships",
    label: "LOUVORES",
  },
  {
    href: "/musics",
    label: "MÚSICAS",
  },
];

export function Header({ user }: HeaderProps) {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <div>
      <div className="flex max-h-16 min-w-full items-center justify-between border-b-[1px] border-[hsl(var(--border))] px-12 py-4">
        <div className="flex items-center gap-11">
          <h1 className="inline-block bg-gradient-to-br from-green-200 from-5% via-green-400 to-green-600 to-95% bg-clip-text text-xl font-bold leading-none text-transparent">
            Calvário Analytics
          </h1>

          <nav className="hidden gap-4 self-center md:flex">
            {PAGES.map((page) => (
              <Link
                key={page.label}
                to={page.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent-foreground"
              >
                {page.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user.id ? <p className="font-medium">LOGADO</p> : <LoginSheet />}

          <ThemeToggle />

          <div onClick={handleNav} className="block md:hidden">
            {nav ? <X size={20} /> : <Menu size={20} />}
          </div>
        </div>
      </div>

      <nav
        className={cn([
          "flex flex-col gap-4 border-b-[1px] border-[hsl(var(--border))] px-12 py-4 transition-all duration-500 ease-in-out md:hidden",
          {
            hidden: !nav,
          },
        ])}
      >
        {PAGES.map((page) => (
          <Link
            key={page.label}
            to={page.href}
            className="text-md font-medium text-muted-foreground transition-colors hover:text-accent-foreground"
          >
            {page.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
