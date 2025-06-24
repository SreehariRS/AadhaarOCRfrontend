/** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
    // Enable TypeScript support
    typescript: {
      // Allow production builds to complete even with type errors (optional, set to false for strict builds)
      ignoreBuildErrors: false,
    },
    // Enable ESLint during builds
    eslint: {
      // Specify directories to lint
      dirs: ['app', 'components'],
    },
    // Configure image optimization (optional, if you need to support external images)
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '5000',
          pathname: '/**',
        },
      ],
    },
  };

  module.exports = nextConfig;