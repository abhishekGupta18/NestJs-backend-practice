import { CronModule } from '@cron/cron.module';
import { EmailQueueModule } from '@email-queue/email-queue.module';
import { MediaUploadQueueModule } from '@media-upload-queue/media-upload-queue.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [EmailQueueModule, MediaUploadQueueModule, CronModule],
})
export class BackgroundModule {}
