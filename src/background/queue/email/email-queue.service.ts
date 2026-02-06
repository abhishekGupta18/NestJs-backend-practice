import { IOtpEmailJob } from '@bg/interfaces/job.interface';
import { EmailService } from '@common/email/email.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailQueueService {
  private readonly logger = new Logger(EmailQueueService.name);
  constructor(private readonly emailService: EmailService) {}

  async sendOtpEmail(data: IOtpEmailJob): Promise<void> {
    try {
      this.logger.debug(`Sending email verification to ${data.email} with token ${data.otp}`);
      
      await this.emailService.send({
        to: data.email,
        subject: 'Your OTP Code',
        text: `Your OTP is ${data.otp}`,
        html: `<p>Your OTP code is: <strong>${data.otp}</strong></p>`
      });

      this.logger.log(`Successfully sent OTP email to ${data.email}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP email to ${data.email}: ${error.message}`);
      throw error;
    }
  }
}
