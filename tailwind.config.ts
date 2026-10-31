import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1C1917",
          muted: "#57534E",
        },
        campus: {
          50: "#F4F8F3",
          100: "#E4EFE0",
          200: "#C5DDBB",
          500: "#3F7A3A",
          600: "#2F6B2C",
          700: "#245523",
          800: "#1B3F1B",
          900: "#132A14",
        },
        cream: {
          DEFAULT: "#FAF7F2",
          dark: "#F1EBE1",
        },
        saffron: {
          DEFAULT: "#E08A2A",
          dark: "#C47218",
        },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 10px 30px -18px rgba(28, 25, 23, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
