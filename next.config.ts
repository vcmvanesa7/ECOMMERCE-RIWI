import type { NextConfig } from "next";

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
        hostname: "res.cloudinary.com", // Cloudinary (productos y perfil)
      },
    ],
  },
};

export default nextConfig;
