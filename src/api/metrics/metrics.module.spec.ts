import { Test, TestingModule } from '@nestjs/testing';
import { MetricsModule } from '@metrics/metrics.module';
import { MetricsService } from '@metrics/metrics.service';
import { MetricsController } from '@metrics/metrics.controller';
import { register } from 'prom-client';

describe('MetricsModule', () => {
  beforeEach(() => {
    register.clear();
  });

  it('should provide MetricsService', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MetricsModule],
    }).compile();

    const service = module.get<MetricsService>(MetricsService);
    expect(service).toBeDefined();
  });

  it('should register MetricsController', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MetricsModule],
    }).compile();

    const controller = module.get<MetricsController>(MetricsController);
    expect(controller).toBeDefined();
  });
});
