import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { detectResources, envDetector, osDetector, processDetector } from '@opentelemetry/resources';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { context } from '@opentelemetry/api';
import { EnvConfig } from '@config/env.config';

@Injectable()
export class OtelService implements OnModuleInit, OnModuleDestroy {
  private sdk: NodeSDK | null = null;
  private readonly logger = new Logger(OtelService.name);

  constructor(private readonly config: ConfigService<EnvConfig>) {}

  async onModuleInit() {
    const env = this.config.get<string>('NODE_ENV') || 'development';
    const enableOtel = env === 'development';
    if (!enableOtel) {
      this.logger.log(`OpenTelemetry is disabled in ${env} mode.`);
      return;
    }

    const serviceName = this.config.get<string>('OTEL_SERVICE_NAME') || 'nestjs-app';
    const otlpEndpoint = this.config.get<string>('OTEL_EXPORTER_OTLP_ENDPOINT') || 'http://localhost:4318/v1/traces';

    context.setGlobalContextManager(new AsyncLocalStorageContextManager());
    const resource = await detectResources({
      detectors: [envDetector, processDetector, osDetector],
    });

    this.sdk = new NodeSDK({
      serviceName,
      resource,
      contextManager: new AsyncLocalStorageContextManager(),
      traceExporter: new OTLPTraceExporter({ url: otlpEndpoint }),
      instrumentations: [getNodeAutoInstrumentations()],
    });

    await this.sdk.start();

    this.logger.log(`✅ OpenTelemetry tracing started for: ${serviceName}`);
    this.logger.log(`📤 Exporting traces to: ${otlpEndpoint}`);
  }

  async onModuleDestroy() {
    if (this.sdk) {
      await this.sdk.shutdown();
      this.logger.log('🛑 OpenTelemetry SDK shut down');
    }
  }
}
