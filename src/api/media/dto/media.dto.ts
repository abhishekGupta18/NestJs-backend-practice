import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
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

export class DirectUploadBodyDto {
  @ApiProperty({ type: 'string', format: 'binary', description: 'The file to upload' })
  @IsOptional()
  file: any;

  @ApiProperty({ enum: MediaFileEntityType, example: MediaFileEntityType.PRODUCT })
  @IsEnum(MediaFileEntityType)
  @IsNotEmpty()
  entityType: MediaFileEntityType;

  @ApiProperty({ example: 'uuid-here' })
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @ApiProperty({ enum: MediaFileType, example: MediaFileType.PRODUCT_IMAGE_MAIN })
  @IsEnum(MediaFileType)
  @IsNotEmpty()
  fileType: MediaFileType;
}

export class ConfirmUploadResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ description: 'The signed access URL for the uploaded file' })
  url: string;
}

export class ConfirmUploadApiResponseDto extends ApiResponse<ConfirmUploadResponseDto> {
  @ApiProperty({ type: () => ConfirmUploadResponseDto })
  declare data?: ConfirmUploadResponseDto;
}

export class GetMediaResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: MediaFileEntityType })
  entityType: string;

  @ApiProperty()
  entityId: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ enum: MediaAccessLevel })
  accessLevel: string;

  @ApiProperty({ description: 'The fresh signed access URL' })
  url: string;

  @ApiProperty()
  createdAt: Date;
}

export class GetMediaApiResponseDto extends ApiResponse<GetMediaResponseDto> {
  @ApiProperty({ type: () => GetMediaResponseDto })
  declare data?: GetMediaResponseDto;
}