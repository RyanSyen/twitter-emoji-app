/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "img.clerk.com",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // will be performed in github ci build actions
  },
  eslint: {
    ignoreDuringBuilds: true, // will be performed in github ci build actions
  },
};

export default config;
