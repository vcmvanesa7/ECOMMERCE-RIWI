import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google OAuth
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Cloudinary (products y profile)
      },
    ],
    domains: [
      "images.unsplash.com",
      "images.pexels.com",
      "i.imgur.com",
      "cdn.sanity.io",
    ],
  },
};

// Plugin de next-intl (route: src/i18n/request.ts)
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
