import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        page: "var(--color-bg)",
        "page-secondary": "var(--color-bg-secondary)",
        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
        accent: "var(--color-accent)",
        "accent-hover": "var(--color-accent-hover)",
        muted: "var(--color-muted)",
        text: "var(--color-text)",
        "text-secondary": "var(--color-text-secondary)",
        border: "var(--color-border)",
      },
      boxShadow: {
        glow: "0 6px 30px var(--color-glow)",
        "glow-sm": "0 2px 10px var(--color-glow)",
        "glow-lg": "0 10px 50px var(--color-glow)",
      },
      fontFamily: {
        theme: "var(--font)",
      },
      fontSize: {
        base: "var(--font-size-base)",
      },
    },
  },
  plugins: [],
};
export default config;

