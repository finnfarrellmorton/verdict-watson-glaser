import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Verdict | Critical-thinking assessment preparation",
    template: "%s | Verdict"
  },
  description:
    "Independent critical-thinking assessment preparation with realistic practice, reasoning analytics and graduate-employer research.",
  metadataBase: new URL("https://verdict-watson-glaser.vercel.app")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
