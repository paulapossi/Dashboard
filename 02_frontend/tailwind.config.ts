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
                background: "var(--background)",
                foreground: "var(--foreground)",
                // Deine Life OS Farben
                life: {
                    navy: "#1E3A8A",      // Das dunkle Blau (Wasser)
                    glass: "#FFFFFF",     // Glas Weiß
                    gray: "#F3F4F6",      // Hintergrund
                }
            },
        },
    },
    plugins: [],
};
export default config;