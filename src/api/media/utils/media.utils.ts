import { 
  MediaFileEntityType, 
  MediaFileType, 
  MediaAccessLevel 
} from "../dto/media.dto";
import { v4 as uuidv4 } from "uuid";
import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Generates a standardized S3 key for media files.
 */
export function generateMediaKey(
  env: string,
  accessLevel: MediaAccessLevel,
  entityType: MediaFileEntityType,
  entityId: string,
  fileName: string
): string {
  const fileExtension = fileName.split('.').pop() || 'file';
  const uniqueFileName = `${uuidv4()}.${fileExtension}`;
  return `${env}/${accessLevel}/${entityType}/${entityId}/${uniqueFileName}`;
}

/**
 * Checks if a given MediaFileType is considered an image.
 */
export function isImageFileType(fileType: MediaFileType): boolean {
  const imageTypes = [
    MediaFileType.PROFILE_IMAGE,
    MediaFileType.COVER_IMAGE,
    MediaFileType.PRODUCT_IMAGE_MAIN,
    MediaFileType.PRODUCT_IMAGE_VARIANT,
  ];
  return imageTypes.includes(fileType);
}

/**
 * Enforces domain-specific file type rules for different entity types.
 */
export function validateTypeConstraints(entityType: MediaFileEntityType, fileType: MediaFileType): void {
  const constraints: Record<MediaFileEntityType, MediaFileType[]> = {
    [MediaFileEntityType.PRODUCT]: [MediaFileType.PRODUCT_IMAGE_MAIN, MediaFileType.PRODUCT_IMAGE_VARIANT],
    [MediaFileEntityType.USER]: [MediaFileType.PROFILE_IMAGE, MediaFileType.COVER_IMAGE],
    [MediaFileEntityType.ORDER]: [MediaFileType.INVOICE, MediaFileType.RECEIPT],
  };

  const allowedTypes = constraints[entityType];
  if (!allowedTypes || !allowedTypes.includes(fileType)) {
    throw new BadRequestException(`Invalid fileType "${fileType}" for entityType "${entityType}".`);
  }
}

/**
 * Generates a temporary pre-signed URL for S3 object access.
 */
export async function generateSignedUrl(
  s3Client: S3Client,
  bucket: string,
  key: string,
  expiresInSeconds: number = 3600
): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    return await getSignedUrl(s3Client as any, command, { expiresIn: expiresInSeconds });
  } catch (error) {
    throw new InternalServerErrorException('Could not generate access URL');
  }
}

