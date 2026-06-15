// Shim for cloudflare:workers module when running outside Cloudflare (e.g. Vercel)
// API routes that depend on D1 will not function, but the build will succeed.
export const env = {};
