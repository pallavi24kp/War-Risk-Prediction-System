/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Only include react-globe.gl and globe.gl for CJS/ESM interop.
  // Do NOT include 'three' or 'three-globe' — that causes webpack to create
  // a duplicate Three.js bundle separate from globe.gl's internal one,
  // which triggers the `determinantAffine` API mismatch error.
  transpilePackages: ['react-globe.gl', 'globe.gl'],
  webpack: (config) => {
    // Prevent canvas from being bundled (Three.js WebGL uses browser canvas)
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
};

export default nextConfig;
