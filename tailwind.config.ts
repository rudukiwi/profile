import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: Object.fromEntries(["ground", "raise", "line", "paper", "mute", "signal"].map((k) => [k, `rgb(var(--${k}) / <alpha-value>)`])),
      muted: "rgb(var(--raise) / <alpha-value>)",
      fontFamily: { display: ["var(--font-display)"], head: ["var(--font-head)", "Georgia", "serif"], hand: ["var(--font-hand)", "cursive"], serif: ["var(--font-display)"] },
    },
  },
  plugins: [],
};
export default config;
