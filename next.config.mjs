/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.simpleicons.org',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      }
    ],
  },

  webpack: (config, { webpack, isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        encoding: false,
      };
    }
    // Fully ignore fs and encoding to prevent annoying Webpack warnings
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^(fs|encoding)$/,
      })
    );
    return config;
  },
};

export default nextConfig;
