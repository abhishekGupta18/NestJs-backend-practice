import { DBModule } from '@db/db.module';
import { HealthController } from '@health/health.controller';
import { HealthResolver } from '@health/health.resolver';
import { HealthService } from '@health/health.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { RedisModule } from '@redis/redis.module';

@Module({
  imports: [TerminusModule, HttpModule, DBModule, RedisModule],
  controllers: [HealthController],
  providers: [HealthResolver, HealthService],
  exports: [HealthService],
})
export class HealthModule {}
