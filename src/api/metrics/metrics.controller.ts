import { ResponseUtil } from '@common/helpers/response.utils';
import { RouteNames } from '@common/route-names';
import { MetricsService } from '@metrics/metrics.service';
import { Controller, Get, Header } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { register } from 'prom-client';

@Controller(RouteNames.METRICS)
@ApiTags('Metrics-Controller')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get(RouteNames.INCREMENT)
  @ApiOperation({ summary: 'Increment HTTP request counter' })
  @ApiResponse({ status: 200, description: 'HTTP request counter incremented successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  incrementHttpRequests() {
    this.metricsService.incrementHttpRequests();
    return ResponseUtil.success(null, 'HTTP request counter incremented');
  }

  @Get(RouteNames.ACTIVE_USERS)
  @ApiOperation({ summary: 'Set active users gauge' })
  @ApiResponse({ status: 200, description: 'Active users gauge set successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  setActiveUsers() {
    this.metricsService.setActiveUsers(5);
    return ResponseUtil.success(null, 'Active users gauge set');
  }

  @Get()
  @Header('Content-Type', 'text/plain')
  @ApiOperation({ summary: 'Get default metrics' })
  @ApiResponse({ status: 200, description: 'Metrics retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Failed to retrieve metrics' })
  async getDefaultMetrics(): Promise<any> {
    try {
      const metrics = await register.metrics();
      return metrics;
    } catch (error) {
      return ResponseUtil.error('Failed to retrieve metrics', 500);
    }
  }
}
