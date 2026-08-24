import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ink: {
          DEFAULT: "var(--background)",
          surface: "var(--surface)",
          border: "var(--border-ink)",
          borderLight: "var(--border-ink-light)",
        },
        ivory: {
          DEFAULT: "var(--text-primary)",
          muted: "var(--text-muted)",
          subtle: "var(--text-subtle)",
        },
        brass: {
          DEFAULT: "var(--accent-brass)",
          hover: "var(--accent-brass-hover)",
          glow: "rgba(198, 161, 91, 0.15)",
          dark: "#8C6E34",
        },
        sage: {
          DEFAULT: "var(--accent-sage)",
          muted: "var(--accent-sage-muted)",
          border: "var(--accent-sage-border)",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-ibm-mono)", "monospace"],
      },
      borderRadius: {
        card: "14px",
        pill: "100px",
      },
      boxShadow: {
        editorial: "0 10px 30px -10px rgba(0,0,0,0.45)",
        glow: "0 0 35px -5px rgba(198, 161, 91, 0.2)",
      },
    },
  },
  plugins: [],
};
export default config;
