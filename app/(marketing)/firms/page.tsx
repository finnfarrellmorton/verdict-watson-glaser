import { FirmDirectory } from "@/components/firms/firm-directory";
import { SiteHeader } from "@/components/navigation/site-header";
import { getFirms } from "@/lib/legacy-data";

export default function FirmsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl font-semibold">Firm research</h1>
        <p className="mt-4 max-w-3xl text-secondary">
          Search firms by name, training intake, salary band, offices and practice strengths. Figures should be treated as research data, not official rankings.
        </p>
        <FirmDirectory firms={getFirms()} />
      </main>
    </>
  );
}
