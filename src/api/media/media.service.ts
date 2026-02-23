import { Injectable, Inject, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { S3Client, HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { 
  MediaFileEntityType, 
  MediaFileType, 
  MediaAccessLevel, 
  ConfirmUploadResponseDto,
  DirectUploadBodyDto,
  GetMediaResponseDto
} from './dto/media.dto';
import { S3_CLIENT } from './provider/s3.provider';
import { MediaDbService } from '@db/media/media-db.service';
import { 
  generateMediaKey, 
  isImageFileType, 
  validateTypeConstraints, 
  generateSignedUrl 
} from './utils/media.utils';

@Injectable()
export class MediaService {
  constructor(
    @Inject(S3_CLIENT) private readonly s3Client: S3Client,
    private readonly config: ConfigService,
    private readonly mediaDb: MediaDbService,
  ) {}

  /**
   * Advanced one-step file upload with metadata validation and private access.
   */
  async directUpload(dto: DirectUploadBodyDto, file: any): Promise<ConfirmUploadResponseDto> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // 1. Domain Validation via Utility
    validateTypeConstraints(dto.entityType, dto.fileType);

    const accessLevel = MediaAccessLevel.PRIVATE;
    const env = this.config.get('NODE_ENV') || 'development';
    
    // 2. Generate Key using Utility
    const key = generateMediaKey(env, accessLevel, dto.entityType, dto.entityId, file.originalname);

    // 3. Create DB record via DB Service
    const mediaFile = await this.mediaDb.createMediaRecord({
      entityId: dto.entityId,
      entityType: dto.entityType,
      s3Key: key,
      accessLevel,
      fileName: file.originalname,
      fileType: dto.fileType,
      isImage: isImageFileType(dto.fileType),
    });

    // 4. Upload to S3
    try {
      await this.s3Client.send(new PutObjectCommand({
        Bucket: this.config.getOrThrow('AWS_S3_BUCKET'),
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }));
    } catch (error) {
      throw new InternalServerErrorException('S3 transmission failed');
    }

    // 5. Confirm and Return
    return this.confirmUpload(mediaFile.id);
  }

  async getMediaById(id: string): Promise<GetMediaResponseDto> {
    const mediaFile = await this.mediaDb.findMediaById(id);

    if (!mediaFile) {
      throw new BadRequestException('Media record not found');
    }

    if (mediaFile.status !== 'COMPLETED') {
      throw new BadRequestException('Media upload is not yet completed');
    }

    const bucket = this.config.getOrThrow('AWS_S3_BUCKET');
    const url = await generateSignedUrl(this.s3Client, bucket, mediaFile.s3_key);

    return {
      id: mediaFile.id,
      entityType: mediaFile.entity_type,
      entityId: mediaFile.entity_id,
      status: mediaFile.status,
      accessLevel: mediaFile.access_level as MediaAccessLevel,
      url,
      createdAt: mediaFile.created_at,
    };
  }

  private async confirmUpload(mediaId: string): Promise<ConfirmUploadResponseDto> {
    const mediaFile = await this.mediaDb.findMediaById(mediaId);
    if (!mediaFile) throw new BadRequestException('Record missing');

    const bucket = this.config.getOrThrow('AWS_S3_BUCKET');

    try {
      await this.s3Client.send(new HeadObjectCommand({
        Bucket: bucket,
        Key: mediaFile.s3_key,
      }));
    } catch (error) {
      throw new BadRequestException('File not found in storage');
    }

    const updatedMedia = await this.mediaDb.updateMediaStatus(mediaId, 'COMPLETED');
    const signedUrl = await generateSignedUrl(this.s3Client, bucket, updatedMedia.s3_key);

    return { 
      id: updatedMedia.id, 
      status: updatedMedia.status,
      url: signedUrl 
    };
  }
}