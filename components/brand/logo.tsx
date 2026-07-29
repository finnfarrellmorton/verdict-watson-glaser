import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-3" aria-label="Verdict home">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand font-serif text-lg font-semibold text-white">
        V
      </span>
      <span className="leading-tight">
        <span className="block text-base font-semibold text-ink">Verdict</span>
        <span className="block text-xs text-muted">Critical-thinking prep</span>
      </span>
    </Link>
  );
}
