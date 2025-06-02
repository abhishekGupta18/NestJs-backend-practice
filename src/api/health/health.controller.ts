import { RouteNames } from '@common/route-names';
import { HealthService } from '@health/health.service';
import { Controller, Get, Render } from '@nestjs/common';
import { ApiExcludeController, ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';

@Controller(RouteNames.HEALTH)
@ApiTags('Health')
// @ApiExcludeController()
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

  @Get(RouteNames.HEALTH_UI)
  @ApiExcludeEndpoint()
  @Render('health') // Renders views/health.pug
  async showHealth() {
    const raw = await this.healthService.checkHealth();
    return {
      status: raw.status,
      info: raw.info,
      user: `Developer`,
    };
  }
}
