import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#09141A',
        'input-bg': 'rgba(255, 255, 255, 0.06)',
        'card-dark': '#152229',
        'brand-primary': '#4B9ECE',
        'brand-secondary': '#2D8AB4',
        'button-primary': '#4A9FCD',
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(75, 158, 206, 0.6)',
      }
    },
  },
  plugins: [],
};
export default config; 