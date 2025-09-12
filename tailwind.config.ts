import type { Config } from 'tailwindcss';
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#f97316",
          dark: "#ea580c"
        }
      },
      borderRadius: { '2xl': '1rem' },
      boxShadow: { soft: "0 10px 30px rgba(0,0,0,.12)" }
    }
  },
  plugins: []
};
export default config;
