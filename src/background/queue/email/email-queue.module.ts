import { QueueName } from '@bg/constants/job.constant';
// import { EmailService } from '@email/email.service';
// import { SendgridProvider } from '@email/providers/send-grid.provider';
import { EmailQueueEvents } from '@email-queue/email-queue.events';
import { EmailQueueService } from '@email-queue/email-queue.service';
import { EmailProcessor } from '@email-queue/email.processor';
import { EmailQueue } from '@email-queue/email.queue';
import { BullModule } from '@nestjs/bullmq';
import { Injectable, Module } from '@nestjs/common';

@Injectable()
export class EmailQueueConfig {
  static getQueueConfig() {
    return BullModule.registerQueue({
      name: QueueName.EMAIL,
      streams: {
        events: {
          maxLen: 1000,
        },
      },
    });
  }
}

@Module({
  imports: [EmailQueueConfig.getQueueConfig()],
  providers: [
    EmailQueueService,
    EmailProcessor,
    EmailQueueEvents,
    EmailQueue,
    // EmailService,
    // {
    //   provide: 'EmailProvider',
    //   useClass: SendgridProvider,
    // },
  ],
  exports: [EmailQueue],
})
export class EmailQueueModule {}
