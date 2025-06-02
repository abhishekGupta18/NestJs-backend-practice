import { HealthIndicatorResult, HealthIndicator } from '@nestjs/terminus';

export class MockRedisHealthIndicator extends HealthIndicator {
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    return this.getStatus(key, true);
  }
}
