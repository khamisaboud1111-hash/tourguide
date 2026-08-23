/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // Placeholder photo service — used only until real tour photos
        // are added under /public/photos. See PLACEHOLDER-IMAGES.md.
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
    // Serve local public/photos with responsive sizes, modern formats
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
