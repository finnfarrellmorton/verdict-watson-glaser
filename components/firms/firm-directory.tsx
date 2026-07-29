"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, Td, Th } from "@/components/ui/table";
import type { FirmRecord } from "@/types/firms";

export function FirmDirectory({ firms }: { firms: FirmRecord[] }) {
  const [query, setQuery] = useState("");
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return firms;
    return firms.filter((firm) =>
      [firm.name, firm.tag, firm.summary, firm.note, firm.location, firm.footprint, firm.seats?.join(" "), firm.practiceAreas?.join(" ")]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }, [firms, query]);

  return (
    <section className="mt-8">
      <label className="relative block max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted" aria-hidden />
        <Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search firm, practice area, location" />
      </label>
      <p className="mt-4 text-sm text-secondary">{visible.length} firms</p>
      <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-surface">
        <Table>
          <thead>
            <tr>
              <Th>Firm</Th>
              <Th>Type</Th>
              <Th>Seats</Th>
              <Th>Offices</Th>
              <Th>NQ salary</Th>
            </tr>
          </thead>
          <tbody>
            {visible.map((firm) => (
              <tr key={firm.slug} className="hover:bg-surface2">
                <Td>
                  <Link href={`/firms/${firm.slug}`} className="font-semibold text-brand hover:underline">
                    {firm.name}
                  </Link>
                  <p className="mt-1 text-sm text-secondary">{firm.summary ?? firm.note}</p>
                </Td>
                <Td>{firm.tag}</Td>
                <Td className="font-mono">{firm.traineeSeats ?? "N/A"}</Td>
                <Td className="font-mono">{firm.offices}</Td>
                <Td>{firm.salary?.newlyQualified ?? "Data unavailable"}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </section>
  );
}
