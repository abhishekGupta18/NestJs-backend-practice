import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { Counter, Histogram } from 'prom-client';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  private static httpRequestDurationHistogram: Histogram<string>;
  private static httpRequestCounter: Counter<string>;

  constructor() {
    if (!MetricsMiddleware.httpRequestDurationHistogram) {
      MetricsMiddleware.httpRequestDurationHistogram = new Histogram({
        name: 'http_request_duration_seconds',
        help: 'Duration of HTTP requests in seconds',
        labelNames: ['method', 'route', 'status'],
      });
    }

    if (!MetricsMiddleware.httpRequestCounter) {
      MetricsMiddleware.httpRequestCounter = new Counter({
        name: 'http_requests_total',
        help: 'Total number of HTTP requests',
        labelNames: ['method', 'route', 'status'],
      });
    }
  }

  use(req: Request, res: Response, next: () => void) {
    const route = req.route?.path || req.originalUrl;
    const method = req.method;

    const end = MetricsMiddleware.httpRequestDurationHistogram.startTimer();

    res.on('finish', () => {
      const status = res.statusCode;
      end({ method, route, status });
      MetricsMiddleware.httpRequestCounter.inc({ method, route, status });
    });

    next();
  }
}
