import { QueueName } from '@bg/constants/job.constant';
// import { MediaUploadService } from '@media-upload/media-upload.service';
// import { AwsProvider } from '@media-upload/providers/aws.provider';
import { MediaUploadQueueEvents } from '@media-upload-queue/media-upload-queue.events';
import { MediaUploadQueueService } from '@media-upload-queue/media-upload-queue.service';
import { MediaUploadProcessor } from '@media-upload-queue/media-upload.processor';
import { MediaUploadQueue } from '@media-upload-queue/media-upload.queue';
import { BullModule } from '@nestjs/bullmq';
import { Injectable, Module } from '@nestjs/common';

@Injectable()
export class MediaUploadQueueConfig {
  static getQueueConfig() {
    return BullModule.registerQueue({
      name: QueueName.MEDIA_UPLOAD,
      streams: {
        events: {
          maxLen: 1000,
        },
      },
    });
  }
}

@Module({
  imports: [MediaUploadQueueConfig.getQueueConfig()],
  providers: [
    MediaUploadQueueService,
    MediaUploadProcessor,
    MediaUploadQueueEvents,
    MediaUploadQueue,
    // MediaUploadService,
    // {
    //   provide: 'StorageProvider',
    //   useClass: AwsProvider,
    // },
  ],
  exports: [MediaUploadQueue],
})
export class MediaUploadQueueModule {}
