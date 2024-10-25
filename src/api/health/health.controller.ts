import { RouteNames } from '@common/route-names';
import { HealthService } from '@health/health.service';
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';

@Controller(RouteNames.HEALTH)
@ApiTags('Health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'Check the health of the service',
    description: 'Health check endpoint',
  })
  async check() {
    return this.healthService.checkHealth();
  }
}
