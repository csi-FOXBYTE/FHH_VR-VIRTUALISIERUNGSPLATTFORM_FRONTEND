export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  const { AzureMonitorTraceExporter } = await import(
    '@azure/monitor-opentelemetry-exporter'
  );
  const { registerOTel } = await import('@vercel/otel');

  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    const traceExporter = new AzureMonitorTraceExporter({
      connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
    });

    registerOTel({
      serviceName: 'fhhvr.frontend',
      traceExporter
    });
  } else {
    registerOTel({
      serviceName: 'fhhvr.frontend',
    });
  }
}
