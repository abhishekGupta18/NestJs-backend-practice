import { QueueName } from '@bg/constants/job.constant';
import { CronQueueEvents } from '@cron/cron.events';
import { CronProcessor } from '@cron/cron.processor';
import { CronQueue } from '@cron/cron.queue';
import { CronScheduler } from '@cron/cron.scheduler';
import { CronService } from '@cron/cron.service';
import { BullModule } from '@nestjs/bullmq';
import { Injectable, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Injectable()
export class CronQueueConfig {
  static getQueueConfig() {
    return BullModule.registerQueue({
      name: QueueName.CRON,
      streams: {
        events: {
          maxLen: 1000,
        },
      },
      defaultJobOptions: {
        attempts: 1,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    });
  }
}

@Module({
  imports: [ScheduleModule.forRoot(), CronQueueConfig.getQueueConfig()],
  providers: [CronProcessor, CronScheduler, CronService, CronQueueEvents, CronQueue],
})
export class CronModule {}
