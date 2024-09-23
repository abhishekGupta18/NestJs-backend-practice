import { ResponseUtil } from '@common/Helpers/response.utils';
import { MetricsService } from '@metrics/metrics.service';
import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { register } from 'prom-client';

@Controller('metrics')
@ApiTags('Metrics-Controller')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('increment')
  incrementHttpRequests() {
    this.metricsService.incrementHttpRequests();
    return ResponseUtil.success(null, 'HTTP request counter incremented');
  }

  @Get('active-users')
  setActiveUsers() {
    this.metricsService.setActiveUsers(5);
    return ResponseUtil.success(null, 'Active users gauge set');
  }

  @Get()
  @Header('Content-Type', 'text/plain')
  async getDefaultMetrics(): Promise<any> {
    try {
      const metrics = await register.metrics();
      return metrics;
    } catch (error) {
      return ResponseUtil.error('Failed to retrieve metrics', 500);
    }
  }
}
