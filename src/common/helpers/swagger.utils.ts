import { HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

/**
 * Common Swagger Response for Conflict (409)
 * @param description Optional description, defaults to 'Conflict'
 */
export const ApiConflictResponse = (description: string = 'Conflict') =>
  ApiResponse({
    status: HttpStatus.CONFLICT,
    description,
  });

/**
 * Common Swagger Response for Bad Request (400)
 * @param description Optional description, defaults to 'Invalid request'
 */
export const ApiBadRequestResponse = (description: string = 'Invalid request') =>
  ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description,
  });

/**
 * Common Swagger Response for Unauthorized (401)
 * @param description Optional description, defaults to 'Unauthorized'
 */
export const ApiUnauthorizedResponse = (description: string = 'Unauthorized') =>
  ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description,
  });

/**
 * Common Swagger Response for Forbidden (403)
 * @param description Optional description, defaults to 'Forbidden'
 */
export const ApiForbiddenResponse = (description: string = 'Forbidden') =>
  ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description,
  });

/**
 * Common Swagger Response for Not Found (404)
 * @param description Optional description, defaults to 'Not found'
 */
export const ApiNotFoundResponse = (description: string = 'Not found') =>
  ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description,
  });

/**
 * Common Swagger Response for Internal Server Error (500)
 */
export const ApiInternalServerErrorResponse = (description: string = 'Internal server error') =>
  ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description,
  });

