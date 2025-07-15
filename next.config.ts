import type {NextConfig} from 'next';

const isProd = process.env.NODE_ENV === 'production';

// The name of the repository. This is used to set the base path and asset prefix for GitHub Pages.
const repoName = 'latent-sculptor';

const nextConfig: NextConfig = {
  // The output directory for the static export.
  output: 'export',
  
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // This is required to allow the Firebase Studio preview to connect to the dev server.
    allowedDevOrigins: ["*.cloudworkstations.dev"],
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
  assetPrefix: isProd ? `/${repoName}/` : '',
  basePath: isProd ? `/${repoName}` : '',
};

export default nextConfig;
