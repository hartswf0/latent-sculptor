import type {NextConfig} from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Set the asset prefix and base path for GitHub Pages.
  // The repository name is 'latent-sculptor'.
  assetPrefix: isProd ? '/latent-sculptor/' : '',
  basePath: isProd ? '/latent-sculptor' : '',
};

export default nextConfig;
