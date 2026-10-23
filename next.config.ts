import type { NextConfig } from "next";

// GitHub Pages serves project sites from /<repo>, so the deploy workflow sets BASE_PATH.
// Locally it is unset and the app is served from the root.
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export", // fully static site, written to ./out
  basePath,
};

export default nextConfig;
