import { IsString, IsNotEmpty, IsEnum, IsOptional, IsInt, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiResponse } from '../../../common/dto/api-response';

// Matches your schema enum
export enum MediaFileEntityType {
  PRODUCT = 'PRODUCT',
  ORDER = 'ORDER',
  USER = 'USER',
}

export enum MediaFileType {
  PROFILE_IMAGE = 'PROFILE_IMAGE',
  COVER_IMAGE = 'COVER_IMAGE',
  PRODUCT_IMAGE_MAIN = 'PRODUCT_IMAGE_MAIN',
  PRODUCT_IMAGE_VARIANT = 'PRODUCT_IMAGE_VARIANT',
  INVOICE = 'INVOICE',
  RECEIPT = 'RECEIPT',
}

export enum MediaAccessLevel {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export class GeneratePresignedUrlBodyDto {
  @ApiProperty({ type: 'string', format: 'binary', description: 'Select a file to automatically extract info' })
  file: any;

  @ApiPropertyOptional({ 
    example: 'profile.jpg', 
    description: 'Optional override for file name. If blank, extracted from selected file.' 
  })
  @IsString()
  @IsOptional()
  fileName?: string;

  @ApiPropertyOptional({ 
    example: 'image/jpeg', 
    description: 'Optional override for content type. If blank, extracted from selected file.' 
  })
  @IsString()
  @IsOptional()
  contentType?: string; // e.g., 'image/jpeg'
}

export class GeneratePresignedUrlResponseDto {
  @ApiProperty()
  url: string;

  @ApiProperty()
  fields: Record<string, string>;

  @ApiProperty()
  mediaFileId: string;

  @ApiProperty()
  key: string;
}

export class GeneratePresignedUrlApiResponseDto extends ApiResponse<GeneratePresignedUrlResponseDto> {
  @ApiProperty({ type: () => GeneratePresignedUrlResponseDto })
  declare data?: GeneratePresignedUrlResponseDto;
}


export class ConfirmUploadResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: string;
  
  // Add other relevant fields from the media object if needed
}

export class ConfirmUploadApiResponseDto extends ApiResponse<ConfirmUploadResponseDto> {
  @ApiProperty({ type: () => ConfirmUploadResponseDto })
  declare data?: ConfirmUploadResponseDto;
}