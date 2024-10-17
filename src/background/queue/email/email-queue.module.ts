import { QueueName, QueuePrefix } from '@bg/constants/job.constant';
import { EmailQueueEvents } from '@email-queue/email-queue.events';
import { EmailQueueService } from '@email-queue/email-queue.service';
import { EmailProcessor } from '@email-queue/email.processor';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueName.EMAIL,
      prefix: QueuePrefix.AUTH,
      streams: {
        events: {
          maxLen: 1000,
        },
      },
    }),
  ],
  providers: [EmailQueueService, EmailProcessor, EmailQueueEvents],
})
export class EmailQueueModule {}
