/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  typedRoutes: false,
  outputFileTracingIncludes: {
    "/*": ["./question-bank.js", "./law-firms.js", "./legal-cheek-profile-facts.js"]
  }
};

export default nextConfig;
