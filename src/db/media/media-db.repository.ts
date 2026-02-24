import { DBService } from "@db/db.service";
import { Injectable } from "@nestjs/common";
import { 
  MediaFileEntityType, 
  MediaFileType, 
  MediaAccessLevel 
} from "../../api/media/dto/media.dto";

export interface CreateMediaRecordParams {
  entityId: string;
  entityType: MediaFileEntityType;
  s3Key: string;
  accessLevel: MediaAccessLevel;
  fileName: string;
  fileType: MediaFileType;
  isImage: boolean;
}

export interface MediaFile {
  id: string;
  entity_type: string;
  entity_id: string;
  s3_key: string;
  status: string;
  access_level: string;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class MediaDbRepository {
  constructor(private readonly db: DBService) {}

  async createMediaRecord(params: CreateMediaRecordParams): Promise<MediaFile> {
    return this.db.$transaction(async (tx) => {
      const mediaFile = await tx.media_files.create({
        data: {
          entity_type: params.entityType,
          entity_id: params.entityId,
          s3_key: params.s3Key,
          status: 'PENDING',
          access_level: params.accessLevel,
        },
      });

      if (params.isImage) {
        await tx.image_attributes.create({
          data: {
            media_file_id: mediaFile.id,
            image_type: params.fileType,
            image_name: params.fileName,
          },
        });
      } else {
        await tx.document_attributes.create({
          data: {
            media_file_id: mediaFile.id,
            document_type: params.fileType,
            document_name: params.fileName,
          },
        });
      }

      return mediaFile;
    });
  }

  async findMediaById(id: string): Promise<MediaFile | null> {
    const record = await this.db.media_files.findUnique({
      where: { id },
    });
    return record as MediaFile | null;
  }

  async updateMediaStatus(id: string, status: string): Promise<MediaFile> {
    const record = await this.db.media_files.update({
      where: { id },
      data: { status },
    });
    return record as MediaFile;
  }

  async deleteMediaRecord(id: string): Promise<void> {
    await this.db.media_files.delete({
      where: { id },
    });
  }
}
