/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        cloud: "#f8fafc",
        drift: "#e2e8f0",
        night: "#0b0f1a",
        neon: "#22d3ee",
        sun: "#f59e0b"
      },
      fontFamily: {
        display: ["\"Space Grotesk\"", "system-ui", "sans-serif"],
        body: ["\"IBM Plex Sans\"", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 12px 40px rgba(34, 211, 238, 0.18)",
        lift: "0 14px 30px rgba(15, 23, 42, 0.12)"
      }
    }
  },
  plugins: []
}
