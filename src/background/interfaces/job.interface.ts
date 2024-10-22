import { CronJobName } from '@bg/constants/job.constant';
export interface IEmailJob {
  email: string;
  customerName?: string;
}

export interface IOtpEmailJob extends IEmailJob {
  otp: number;
}

export interface IMediaUploadJob {
  file: Express.Multer.File;
  metadata?: Record<string, any>;
}

export interface ICronJob {
  jobType: CronJobName;
  data?: any;
  options?: {
    priority?: number;
    timestamp?: number;
  };
}
