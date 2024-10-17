import { ApiResponse } from '@common/dto/api-response';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    // Check if the request is an HTTP request
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest();

      // Exclude /metrics endpoint from custom transformation
      if (request.url === '/metrics') {
        // Skip transformation and return raw response
        return next.handle();
      }

      return next.handle().pipe(
        map((data) => ({
          statusCode: data.statusCode ? data.statusCode : context.switchToHttp().getResponse().statusCode,
          status: data.status || 'Success',
          message: data.message || 'Request successful',
          data: data.data || data, // Fallback to the data itself if 'data' property is not present
          error: data.error || null,
        }))
      );
    } else if (context.getType().toString() === 'graphql') {
      // Directly return the response without transformation
      return next.handle().pipe(
        map((data) => ({
          statusCode: 200,
          status: 'Success',
          message: 'Request successful',
          data: data,
          error: null,
        }))
      );
    }

    // Default behavior for other context types (if any)
    return next.handle();
  }
}
