import { EmailQueueModule } from '@email-queue/email-queue.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [EmailQueueModule],
})
export class BackgroundModule {}
