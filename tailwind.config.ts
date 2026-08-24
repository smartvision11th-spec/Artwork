import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: { display: ["var(--font-display)"], body: ["var(--font-body)"], mono: ["var(--font-mono)"] },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },
      boxShadow: { subtle: "0 1px 2px rgb(0 0 0 / 0.04)" }
    }
  },
  plugins: [animate]
};
export default config;
