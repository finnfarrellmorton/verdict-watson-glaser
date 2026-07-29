import Link from "next/link";
import { BarChart3, BookOpenCheck, ClipboardList, LayoutDashboard, Search, Settings } from "lucide-react";
import { Logo } from "@/components/brand/logo";

const items = [
  ["Dashboard", "/app/dashboard", LayoutDashboard],
  ["Practice", "/app/practice", ClipboardList],
  ["Review", "/app/review", BookOpenCheck],
  ["Analytics", "/app/analytics", BarChart3],
  ["Firms", "/app/firms/clifford-chance", Search],
  ["Settings", "/app/settings/profile", Settings]
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Logo />
          <nav className="hidden gap-1 md:flex" aria-label="Application navigation">
            {items.map(([label, href, Icon]) => (
              <Link key={String(label)} href={String(href)} className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-secondary hover:bg-surface2 hover:text-ink">
                <Icon className="h-4 w-4" aria-hidden />
                {label as string}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
