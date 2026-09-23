import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14100E",
        "ink-soft": "#3A322C",
        ivory: "#FAF5EE",
        "ivory-deep": "#F1E8DA",
        rani: "#E01E77",
        "rani-deep": "#B0125C",
        gold: "#C8A15A",
        "gold-soft": "#E4CFA3",
        silver: "#C9CDD2",
        emerald: "#0E6E52",
        wine: "#6E1B36"
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
      },
      letterSpacing: {
        editorial: "0.18em",
        wide2: "0.32em"
      },
      maxWidth: {
        page: "1440px"
      },
      screens: {
        xs: "375px"
      }
    }
  },
  plugins: []
};

export default config;
