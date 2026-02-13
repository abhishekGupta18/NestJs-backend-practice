import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { GeneratePresignedUrlApiResponseDto, ConfirmUploadApiResponseDto, MediaFileEntityType, MediaFileType, MediaAccessLevel } from '../dto/media.dto';

export function ApiGeneratePresignedUrl() {
  return applyDecorators(
    ApiOperation({ summary: 'Generate a presigned URL for file upload to S3 (Select file to extract info)' }),
    ApiConsumes('multipart/form-data'),
    ApiParam({ name: 'entityType', enum: MediaFileEntityType, description: 'The type of entity the media belongs to' }),
    ApiParam({ name: 'entityId', description: 'The ID of the entity' }),
    ApiParam({ name: 'fileType', enum: MediaFileType, description: 'The specific type of the media file' }),
    ApiParam({ name: 'accessLevel', enum: MediaAccessLevel, description: 'Access level: PUBLIC or PRIVATE' }),
    ApiResponse({ status: HttpStatus.CREATED, type: GeneratePresignedUrlApiResponseDto, description: 'Presigned URL generated successfully' }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid request parameters' }),
    ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' }),
  );
}

export function ApiConfirmUpload() {
  return applyDecorators(
    ApiOperation({ summary: 'Confirm that a file has been successfully uploaded to S3' }),
    ApiParam({ name: 'id', description: 'The UUID of the media file to confirm' }),
    ApiResponse({ status: HttpStatus.CREATED, type: ConfirmUploadApiResponseDto, description: 'Upload confirmed and record updated' }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid media file or already processed' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'File not found in S3' }),
    ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' }),
  );
}

export function ApiGetAccessUrl() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a temporary or direct access URL for a media file' }),
    ApiParam({ name: 'id', description: 'The UUID of the media file' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Access URL retrieved successfully' }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Media file not found' }),
    ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' }),
  );
}
