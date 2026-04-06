import type { NextConfig } from "next";

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim()
const hasTurnstile = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
const turnstileDomain = "https://challenges.cloudflare.com"
const isDev = process.env.NODE_ENV === "development"

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${hasTurnstile ? ` ${turnstileDomain}` : ""}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "media-src 'self'",
  `connect-src 'self' ${supabaseUrl}${hasTurnstile ? ` ${turnstileDomain}` : ""}`,
  "worker-src 'self'",
  `frame-src${hasTurnstile ? ` ${turnstileDomain}` : " 'none'"}`,
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
].join("; ")

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
]

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ]
  },
};

export default nextConfig;
