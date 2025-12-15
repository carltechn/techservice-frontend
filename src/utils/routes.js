// Helper for building routes that automatically include the correct base path
// (e.g. "/tech-service" in GitHub Pages production, "/" in local dev).
// Uses Vite's BASE_URL value which is derived from the "base" option in vite.config.js.

const rawBaseUrl = import.meta.env.BASE_URL || '/';
const BASE_PATH =
  rawBaseUrl.endsWith('/') && rawBaseUrl !== '/' ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

export const buildPath = (path) => {
  if (!path) return BASE_PATH || '/';
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
};


