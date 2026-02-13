import { Injectable, Inject, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { S3Client, HeadObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { DBService } from '@db/db.service';
import { GeneratePresignedUrlBodyDto, MediaFileEntityType, MediaFileType, MediaAccessLevel, GeneratePresignedUrlResponseDto, ConfirmUploadResponseDto } from './dto/media.dto';
import { v4 as uuidv4 } from 'uuid';
import { S3_CLIENT } from './provider/s3.provider';

@Injectable()
export class MediaService {
  constructor(
    @Inject(S3_CLIENT) private readonly s3Client: S3Client,
    private readonly config: ConfigService,
    private readonly db: DBService,
  ) {}

  async generatePresignedUrl(
    body: GeneratePresignedUrlBodyDto,
    entityId: string,
    entityType: MediaFileEntityType,
    fileType: MediaFileType,
    accessLevel: MediaAccessLevel,
    file?: any,
  ): Promise<GeneratePresignedUrlResponseDto> {
    const fileName = body.fileName || file?.originalname;
    const contentType = body.contentType || file?.mimetype;

    if (!fileName || !contentType) {
      throw new BadRequestException('File name and content type are required');
    }

    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    
    // 1. Structure the Key: env/accessLevel/entityType/entityId/filename
    const key = `${this.config.get('NODE_ENV')}/${accessLevel}/${entityType}/${entityId}/${uniqueFileName}`;

    // 2. Transaction: Create "Pending" Record + Attributes
    const result = await this.db.$transaction(async (tx) => {
      const mediaFile = await tx.media_files.create({
        data: {
          entity_type: entityType,
          entity_id: entityId,
          s3_key: key,
          status: 'PENDING',
          access_level: accessLevel,
        },
      });

      const isImage = [
        MediaFileType.PROFILE_IMAGE,
        MediaFileType.COVER_IMAGE,
        MediaFileType.PRODUCT_IMAGE_MAIN,
        MediaFileType.PRODUCT_IMAGE_VARIANT,
      ].includes(fileType);

      if (isImage) {
        await tx.image_attributes.create({
          data: {
            media_file_id: mediaFile.id,
            image_type: fileType,
            image_name: fileName,
          },
        });
      } else {
        await tx.document_attributes.create({
          data: {
            media_file_id: mediaFile.id,
            document_type: fileType,
            document_name: fileName,
          },
        });
      }

      return mediaFile;
    });

    // 3. Generate Presigned POST Policy
    try {
      const { url, fields } = await createPresignedPost(this.s3Client, {
        Bucket: this.config.getOrThrow('AWS_S3_BUCKET'),
        Key: key,
        Conditions: [
          ['content-length-range', 0, 10485760], // Max 10MB
          ['eq', '$Content-Type', contentType], // Strict MIME check
        ],
        Fields: {
          'Content-Type': contentType,
        },
        Expires: 300, // 5 minutes
      });

      return { url, fields, mediaFileId: result.id, key };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not generate presigned URL');
    }
  }

  async confirmUpload(mediaId: string): Promise<ConfirmUploadResponseDto> {
    // 1. Fetch the pending record
    const mediaFile = await this.db.media_files.findUnique({
      where: { id: mediaId },
    });

    if (!mediaFile || mediaFile.status !== 'PENDING') {
      throw new BadRequestException('Invalid media file or already processed');
    }

    // 2. Verify file actually exists in S3 (Safety Check)
    try {
      await this.s3Client.send(new HeadObjectCommand({
        Bucket: this.config.getOrThrow('AWS_S3_BUCKET'),
        Key: mediaFile.s3_key,
      }));
    } catch (error) {
      throw new BadRequestException('File not found in S3. Upload may have failed.');
    }

    // 3. Update Status
    const updatedMedia = await this.db.media_files.update({
      where: { id: mediaId },
      data: { status: 'COMPLETED' },
    });

    return {
      id: updatedMedia.id,
      status: updatedMedia.status,
    };
  }
  async getAccessUrl(mediaId: string): Promise<string> {
    const media = await this.db.media_files.findUnique({
      where: { id: mediaId },
    });

    if (!media) {
      throw new BadRequestException('Media file not found');
    }

    if (media.access_level === 'PUBLIC') {
      // Public Access: Return direct URL
      // https://BUCKET.s3.REGION.amazonaws.com/KEY
      return `https://${this.config.get('AWS_S3_BUCKET')}.s3.${this.config.get('AWS_REGION')}.amazonaws.com/${media.s3_key}`;
    }

    // Private Access: Generate Presigned GET URL
    try {
      const command = new GetObjectCommand({
        Bucket: this.config.getOrThrow('AWS_S3_BUCKET'),
        Key: media.s3_key,
      });

      // URL valid for 1 hour
      return getSignedUrl(this.s3Client as any, command, { expiresIn: 3600 });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not generate access URL');
    }
  }
}