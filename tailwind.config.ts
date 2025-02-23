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
        primary: "#4A90E2", // Soft blue
        secondary: "#50C878", // Warm green
        background: "#FFFFFF", // White
        text: "#333333", // Dark gray
        muted: "#666666", // Lighter gray for secondary text
        border: "#CCCCCC", // Light gray for borders
        error: "#E74C3C", // Red for errors


        // Dark mode colors
        darkBackground: "#1A1A1A", // Dark mode background
        darkText: "#E0E0E0", // Light gray text for dark mode
        darkMuted: "#A0A0A0", // Muted text in dark mode
        darkBorder: "#333333", // Borders in dark mode
      },
    },
  },
  plugins: [],
} satisfies Config;
