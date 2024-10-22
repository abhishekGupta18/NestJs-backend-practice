import { JobName, QueueName } from '@bg/constants/job.constant';
import { IMediaUploadJob } from '@bg/interfaces/job.interface';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class MediaUploadQueue {
  private readonly logger = new Logger(MediaUploadQueue.name);

  constructor(@InjectQueue(QueueName.MEDIA_UPLOAD) private mediaUploadQueue: Queue) {}

  async uploadMedia(data: IMediaUploadJob): Promise<void> {
    this.logger.debug(`Adding upload media job for ${JSON.stringify(data.file.originalname)}`);
    await this.mediaUploadQueue.add(JobName.BG_UPLOAD_MEDIA, data);
  }
}
