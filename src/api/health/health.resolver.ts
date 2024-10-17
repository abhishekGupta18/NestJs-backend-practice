import { HealthService } from '@health/health.service';
import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HealthResolver {
  constructor(private healthService: HealthService) {}

  @Query(() => String)
  async healthCheck() {
    const result = await this.healthService.checkHealth();
    return result.status;
  }
}
