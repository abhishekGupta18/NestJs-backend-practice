import { ApiResponse } from '@common/dto/api-response';
import { CustomUnauthorizedException } from '@common/exceptions/custom-unauthorized-exception';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const _request = ctx.getRequest<Request>();

    // Determine context type
    let status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception instanceof HttpException ? (exception.message as string) : 'Internal Server Error';
    let error = exception instanceof HttpException ? exception.message : 'Unknown Error';
    let errorCode: string | undefined;

    if (exception instanceof CustomUnauthorizedException) {
      const exceptionResponse = exception.getResponse() as any;
      status = HttpStatus.UNAUTHORIZED;
      message = exceptionResponse.message;
      error = exceptionResponse.error;
      errorCode = exceptionResponse.errorCode;
    } else if (exception instanceof ForbiddenException) {
      status = HttpStatus.FORBIDDEN;
      message = 'User does not have the appropriate permission or role to access this resource';
    } else if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
        if (Array.isArray(exceptionResponse['message'])) {
          message = exceptionResponse['message'].join('; ');
        } else {
          message = exceptionResponse['message'] as string;
        }
        error = message;
      }
    }

    const formattedResponse: ApiResponse<null> = {
      statusCode: status,
      status: 'Failure',
      message: typeof message === 'string' ? message : 'Error Occurred',
      error: error,
      ...(errorCode && { errorCode }),
    };

    if (host.getType() === 'http') {
      return response.status(status).send(formattedResponse);
    } else {
      return formattedResponse;
    }
  }
}
