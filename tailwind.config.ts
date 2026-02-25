import type { Config } from "tailwindcss"

const config: Config = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            keyframes: {
                marqueeRight: {
                    "0%": { transform: "translateX(-50%)" },
                    "100%": { transform: "translateX(0%)" },
                },
            },
            animation: {
                marqueeRight: "marqueeRight 20s linear infinite",
            },
        },
    },
    plugins: [],
}

export default config
