import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFF7ED",
        "soft-pink": "#FDF2F8",
        "soft-cyan": "#ECFEFF",
        "neon-pink": "#FF2DAA",
        "electric-purple": "#7C3AED",
        "cyan-blue": "#06B6D4",
        "festival-orange": "#F97316",
        "lime-accent": "#A3E635",
        ink: "#111827",
        slatecopy: "#6B7280",
        mutedcopy: "#9CA3AF"
      },
      boxShadow: {
        festival: "0 22px 70px -28px rgba(124, 58, 237, 0.42)",
        neon: "0 0 0 1px rgba(255, 45, 170, 0.25), 0 18px 48px -26px rgba(255, 45, 170, 0.7)"
      },
      backgroundImage: {
        "festival-sheen":
          "linear-gradient(135deg, rgba(255,247,237,0.96) 0%, rgba(253,242,248,0.94) 42%, rgba(236,254,255,0.92) 100%)",
        "sunset-cta":
          "linear-gradient(135deg, #FF2DAA 0%, #7C3AED 48%, #06B6D4 100%)",
        "orange-pink": "linear-gradient(135deg, #F97316 0%, #FF2DAA 100%)"
      }
    }
  },
  plugins: []
};

export default config;
