import { IVerifyEmailJob } from '@bg/interfaces/job.interface';
import { Injectable, Logger } from '@nestjs/common';
// import { EmailService } from '@email/email.service';

@Injectable()
export class EmailQueueService {
  private readonly logger = new Logger(EmailQueueService.name);

  // constructor(private readonly mailService: EmailService) {}

  async sendEmailVerification(data: IVerifyEmailJob): Promise<void> {
    this.logger.debug(`Sending email verification to ${data.email}`);
    // await this.mailService.sendEmailVerification(data.email, data.token);
  }
}
