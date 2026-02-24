import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { 
  ConfirmUploadApiResponseDto, 
  GetMediaApiResponseDto,
  MediaFileEntityType, 
  MediaFileType 
} from '../dto/media.dto';

/**
 * Swagger decorator for the advanced direct upload endpoint.
 */
export function ApiDirectUpload() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Advanced file upload with type validation', 
      description: 'Uploads a file, enforces entity-specific type rules, and returns a private signed URL.' 
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'File and entity metadata',
      type: 'object',
      schema: {
        type: 'object',
        properties: {
          file: { type: 'string', format: 'binary', description: 'The binary file content' },
          entityType: { enum: Object.values(MediaFileEntityType), description: 'PRODUCT, USER, or ORDER' },
          entityId: { type: 'string', description: 'UUID of the entity' },
          fileType: { enum: Object.values(MediaFileType), description: 'Specific type code for the file' },
        },
        required: ['file', 'entityType', 'entityId', 'fileType'],
      },
    }),
    ApiResponse({ 
      status: HttpStatus.CREATED, 
      type: ConfirmUploadApiResponseDto, 
      description: 'Media file processed successfully (Includes Signed URL)' 
    }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Type validation failure or missing file' }),
    ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'S3 or Database failure' }),
  );
}

/**
 * Swagger decorator for the media retrieval endpoint.
 */
export function ApiGetMedia() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Retrieve media details and signed URL', 
      description: 'Returns the metadata and a fresh private signed URL for a specific media file ID.' 
    }),
    ApiResponse({ 
      status: HttpStatus.OK, 
      type: GetMediaApiResponseDto, 
      description: 'Media retrieved successfully' 
    }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Media not found or not completed' }),
  );
}
