import { HealthController } from '@health/health.controller';
import { HealthResolver } from '@health/health.resolver';
import { HealthService } from '@health/health.service';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [HealthResolver, HealthService],
  exports: [HealthService],
})
export class HealthModule {}
