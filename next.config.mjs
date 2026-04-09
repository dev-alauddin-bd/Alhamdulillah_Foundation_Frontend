/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!apiBase) {
      console.warn(
        '⚠ WARNING: NEXT_PUBLIC_API_BASE_URL is not defined! Rewrites may not work properly.'
      );
    }

    return [
      {
        source: '/api/:path*',
        destination: apiBase ? `${apiBase}/api/:path*` : '/404', // fallback to 404
      },
    ];
  },
};

export default nextConfig;
