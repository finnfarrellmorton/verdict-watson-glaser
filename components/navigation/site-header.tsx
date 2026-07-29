import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";

const links = [
  ["How it works", "/#how-it-works"],
  ["Practice", "/app/practice"],
  ["Firm research", "/firms"],
  ["Resources", "/#resources"],
  ["Pricing", "/pricing"]
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm text-secondary md:flex" aria-label="Main navigation">
          {links.map(([label, href]) => (
            <Link key={label} href={href} className="hover:text-ink">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/app/practice">Start free</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
