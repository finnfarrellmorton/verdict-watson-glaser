import type { DomainSlug } from "@/types/assessment";

export const domains: Array<{
  slug: DomainSlug;
  label: string;
  shortLabel: string;
  description: string;
}> = [
  {
    slug: "inference",
    label: "Drawing Inferences",
    shortLabel: "Inference",
    description: "Judge whether a conclusion follows from the evidence, and how strongly."
  },
  {
    slug: "assumptions",
    label: "Recognising Assumptions",
    shortLabel: "Assumptions",
    description: "Spot the hidden premise an argument depends on."
  },
  {
    slug: "deduction",
    label: "Deduction",
    shortLabel: "Deduction",
    description: "Apply stated rules without importing outside knowledge."
  },
  {
    slug: "interpretation",
    label: "Interpretation",
    shortLabel: "Interpretation",
    description: "Choose the conclusion best supported by the passage."
  },
  {
    slug: "arguments",
    label: "Evaluation of Arguments",
    shortLabel: "Arguments",
    description: "Assess whether reasons are relevant, strong, and decision-useful."
  }
];

export function domainLabel(slug: string) {
  return domains.find((domain) => domain.slug === slug)?.label ?? slug;
}
