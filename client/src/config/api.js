// In dev (`npm run dev`) the backend runs separately on its own port, so default to it.
// In a production build (Docker etc.), default to a relative/same-origin path unless
// VITE_API_BASE_URL is explicitly set at build time — see client/Dockerfile.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "http://localhost:8000" : "");
