import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#BEC8AF",
        forground: "#FBF5D8",
        navbars: "#A2AB95",
        backgroundHover: "#FBF5D8",
        text: "#07242B", // Light gray text for dark mode
        muted: "#A0A0A0", // Muted text in dark mode
        border: "#07242B", // Borders in dark mode
      },
    },
  },
  plugins: [],
} satisfies Config;
