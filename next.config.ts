import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the phone (LAN IP) to load Next.js dev resources cross-origin.
  // Add whatever host the "Network:" URL shows for your setup.
  allowedDevOrigins: ["172.20.10.2"],
};

export default nextConfig;
