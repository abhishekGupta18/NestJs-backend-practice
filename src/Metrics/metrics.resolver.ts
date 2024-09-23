import { MetricsService } from '@metrics/metrics.service';
import { Logger } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { register } from 'prom-client';

@Resolver('Metrics')
export class MetricsResolver {
  constructor(private readonly metricsService: MetricsService) {}

  @Mutation(() => String)
  incrementHttpRequests() {
    this.metricsService.incrementHttpRequests();
    return 'HTTP request counter incremented';
  }

  @Mutation(() => String)
  setActiveUsers() {
    this.metricsService.setActiveUsers(5);
    return 'Active users gauge set';
  }

  @Query(() => String)
  async getMetrics() {
    try {
      const metrics = await register.metrics();
      return metrics;
    } catch (error) {
      Logger.error('Failed to retrieve metrics:', error);
      throw new Error('Failed to retrieve metrics');
    }
  }
}
