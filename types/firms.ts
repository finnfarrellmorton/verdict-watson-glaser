export type FirmRecord = {
  slug: string;
  name: string;
  tag: string;
  category?: string;
  prestige: number;
  training: number;
  pay: number;
  work: number;
  balance: number;
  international: number;
  traineeSeats?: number;
  seats?: string[];
  offices: number;
  countries?: number;
  footprint?: string;
  note?: string;
  location?: string;
  summary?: string;
  practiceAreas?: string[];
  salary?: {
    traineeFirst: string;
    traineeSecond: string;
    newlyQualified: string;
  };
  sources?: Array<{
    label: string;
    url?: string;
    date?: string;
  }>;
};
