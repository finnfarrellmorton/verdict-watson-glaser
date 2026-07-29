import { domains } from "@/lib/assessment/domains";
import { Table, Td, Th } from "@/components/ui/table";

export default function AnalyticsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-semibold">Analytics</h1>
      <p className="mt-4 max-w-3xl text-secondary">
        Domain analytics will calculate from authoritative submitted responses. No fake charts are shown before there is evidence.
      </p>
      <div className="mt-8 overflow-hidden rounded-lg border border-border bg-surface">
        <Table>
          <thead>
            <tr>
              <Th>Domain</Th>
              <Th>Accuracy</Th>
              <Th>Attempts</Th>
              <Th>Evidence</Th>
              <Th>Recommended action</Th>
            </tr>
          </thead>
          <tbody>
            {domains.map((domain) => (
              <tr key={domain.slug}>
                <Td className="font-semibold">{domain.label}</Td>
                <Td>No data</Td>
                <Td className="font-mono">0</Td>
                <Td>Insufficient data</Td>
                <Td>Complete diagnostic</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </main>
  );
}
