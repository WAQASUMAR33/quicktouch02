/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize nodemailer for serverless functions
      config.externals = config.externals || [];
      config.externals.push('nodemailer');
    }
    return config;
  },
  // Ensure nodemailer is not bundled
  experimental: {
    serverComponentsExternalPackages: ['nodemailer'],
  },
};

export default nextConfig;
