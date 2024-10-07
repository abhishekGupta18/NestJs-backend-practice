import { Injectable } from '@nestjs/common';
import { Counter, Gauge } from 'prom-client'; // Only import what you need

@Injectable()
export class MetricsService {
  private readonly httpRequestCounter: Counter<string>;
  private readonly activeUsersGauge: Gauge<string>;

  constructor() {
    // Create custom Counter metric
    this.httpRequestCounter = new Counter({
      name: 'total_http_requests',
      help: 'Total number of HTTP requests',
    });

    // Create custom Gauge metric
    this.activeUsersGauge = new Gauge({
      name: 'active_users_gauge',
      help: 'Number of active users at any time',
    });
  }

  // Increment the HTTP request counter
  incrementHttpRequests() {
    this.httpRequestCounter.inc();
  }

  // Set the number of active users (example custom metric)
  setActiveUsers(value: number) {
    this.activeUsersGauge.set(value);
  }
}
