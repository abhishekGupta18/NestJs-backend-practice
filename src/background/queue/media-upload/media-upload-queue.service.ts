import { IMediaUploadJob } from '@bg/interfaces/job.interface';
// import { UploadMediaDto } from '@media-upload/dto/upload-media.dto';
// import { MediaUploadService } from '@media-upload/media-upload.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MediaUploadQueueService {
  private readonly logger = new Logger(MediaUploadQueueService.name);

  // constructor(private readonly mediaUploadService: MediaUploadService) {}

  async uploadMedia(data: IMediaUploadJob): Promise<void> {
    try {
      this.logger.debug(`Uploading file ${data.file.originalname}`);
      // const media: UploadMediaDto = {
      //   file: data.file,
      // };
      // await this.mediaUploadService.uploadMedia(media);
    } catch (error) {
      this.logger.error(`Failed to upload media: ${error.message}`);
      throw error;
    }
  }
}
