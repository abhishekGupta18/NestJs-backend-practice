import { RouteNames } from '@common/route-names';
import { PlainTextScalar } from '@common/scalars/plain-text.scalar';
import { MetricsController } from '@metrics/metrics.controller';
import { MetricsResolver } from '@metrics/metrics.resolver';
import { MetricsService } from '@metrics/metrics.service';
import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true,
      },
      path: `/${RouteNames.METRICS}`,
    }),
  ],
  providers: [MetricsService, MetricsResolver, PlainTextScalar],
  controllers: [MetricsController],
  exports: [MetricsService],
})
export class MetricsModule {}
