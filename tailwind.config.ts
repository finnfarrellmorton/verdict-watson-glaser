import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--canvas)",
        surface: "var(--surface)",
        surface2: "var(--surface-2)",
        surface3: "var(--surface-3)",
        ink: "var(--ink)",
        secondary: "var(--secondary-text)",
        muted: "var(--muted-text)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        brand: "var(--brand)",
        "brand-hover": "var(--brand-hover)",
        "brand-muted": "var(--brand-muted)",
        accent: "var(--accent)",
        "accent-muted": "var(--accent-muted)",
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
        focus: "var(--focus)"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "ui-sans-serif", "system-ui"],
        serif: ["var(--font-source-serif)", "Georgia", "serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular"]
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px"
      },
      boxShadow: {
        elevated: "0 18px 60px rgba(25, 42, 68, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
