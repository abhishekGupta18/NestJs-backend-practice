import { Injectable } from '@nestjs/common';
import { HealthCheckService } from '@nestjs/terminus';

@Injectable()
export class HealthService {
  constructor(private health: HealthCheckService) {}

  async checkHealth() {
    return this.health.check([]);
  }
}
