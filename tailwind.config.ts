import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // डार्क मोड इनेबल करने के लिए
  theme: {
    extend: {
      colors: {
        metaGreen: "#25D366", // Meta/WhatsApp Green
        metaBlue: "#0084FF",  // Meta Blue
        darkBg: "#0B141A",    // WhatsApp Dark Background
      },
    },
  },
  plugins: [],
};
export default config;

