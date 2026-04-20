/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        /* ========================= */
        /* BRAND COLORS */
        /* ========================= */
        primary: {
          DEFAULT: "#2563EB", // blue-600
          light: "#3B82F6",   // blue-500
          dark: "#1D4ED8",    // blue-700
        },

        /* ========================= */
        /* UI COLORS */
        /* ========================= */
        background: "#F8FAFC", // slate-50
        surface: "#FFFFFF",

        text: {
          DEFAULT: "#0F172A", // slate-900
          muted: "#64748B",   // slate-500
        },

        border: "#E2E8F0", // slate-200

        success: "#16A34A",
        danger: "#DC2626",
        warning: "#F59E0B",
      },

      /* ========================= */
      /* FONT */
      /* ========================= */
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },

      /* ========================= */
      /* BORDER RADIUS */
      /* ========================= */
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },

      /* ========================= */
      /* SHADOWS (SOFT SaaS STYLE) */
      /* ========================= */
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.05)",
        DEFAULT: "0 4px 12px rgba(0,0,0,0.05)",
        md: "0 6px 20px rgba(0,0,0,0.08)",
        lg: "0 10px 30px rgba(0,0,0,0.1)",
      },

      /* ========================= */
      /* SPACING (OPTIONAL SCALE) */
      /* ========================= */
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },

      /* ========================= */
      /* TRANSITIONS */
      /* ========================= */
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },

  plugins: [],
};