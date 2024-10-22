import { LoggerService } from '@logger/logger.service';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    const { method, url, httpVersion, headers, body, query } = request;
    const remoteAddr = request.ip || request.socket.remoteAddress;
    const userAgent = headers['user-agent'] || 'unknown';
    const referrer = headers['referer'] || headers['referrer'] || 'No Referer';
    const startTime = new Date().toISOString();
    const startTimestamp = Date.now();

    return next.handle().pipe(
      tap(() => {
        const endTimestamp = Date.now();
        const endTime = new Date().toISOString();
        const responseTime = endTimestamp - startTimestamp;
        const { statusCode } = response;
        const contentLength = response.get('content-length') || 'unknown';

        // Log a single combined message with all request and response details
        this.logger.http(
          `HTTP Log - Start Time: ${startTime}, End Time: ${endTime}, Total Duration: ${responseTime}ms\n` +
            `Remote Address: ${remoteAddr}, Method: ${method}, URL: ${url}, HTTP Version: ${httpVersion}\n` +
            `User-Agent: ${userAgent}, Referrer: ${referrer}\n` +
            `Request Body: ${JSON.stringify(body)}, Query Params: ${JSON.stringify(query)}\n` +
            `Response Status: ${statusCode}, Content Length: ${contentLength}\n`
        );
      })
    );
  }
}
