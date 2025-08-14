import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';
import { version } from './package.json';

const withNextIntl = createNextIntlPlugin('./src/server/i18n/request.ts');

const nextConfig: NextConfig = {
  output: 'standalone',
  webpack: (config, { isServer, nextRuntime }) => {
    if (!isServer || nextRuntime === 'edge') {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@azure/monitor-opentelemetry-exporter': path.resolve(
          __dirname,
          'stubs/azure-exporter.ts',
        ),
      };
    }

    return config;
  },
  env: {
    version,
  },
};

export default withNextIntl(nextConfig);
