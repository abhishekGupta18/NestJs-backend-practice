import { Injectable } from "@nestjs/common";
import { MediaDbRepository, CreateMediaRecordParams, MediaFile } from "./media-db.repository";
import { 
  MediaFileEntityType, 
  MediaFileType, 
  MediaAccessLevel 
} from "../../api/media/dto/media.dto";

@Injectable()
export class MediaDbService {
  constructor(private readonly mediaRepository: MediaDbRepository) {}

  async createMediaRecord(params: CreateMediaRecordParams): Promise<MediaFile> {
    return this.mediaRepository.createMediaRecord(params);
  }

  async findMediaById(id: string): Promise<MediaFile | null> {
    return this.mediaRepository.findMediaById(id);
  }

  async updateMediaStatus(id: string, status: string): Promise<MediaFile> {
    return this.mediaRepository.updateMediaStatus(id, status);
  }

  async deleteMediaRecord(id: string): Promise<void> {
    return this.mediaRepository.deleteMediaRecord(id);
  }
}
