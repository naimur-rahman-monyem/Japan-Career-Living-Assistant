import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: { colors: { ink: "#172033", ocean: "#175cd3", sakura: "#f7d6e0", mist: "#f5f7fb" } } },
  plugins: []
};
export default config;
