import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { version } from "./package.json";

const withNextIntl = createNextIntlPlugin("./src/server/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  env: {
    version,
  },
  rewrites: async () => {
    if (!process.env.BACKEND_URL) throw new Error("No backend url supplied!");

    return [
      {
        source: "/api/backend/:path*",
        destination: `${process.env.BACKEND_URL}/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
