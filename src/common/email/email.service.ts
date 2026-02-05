// common/email/email.service.ts
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import { ISendEmail } from './interface/interface';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    // Initialize SendGrid with the API Key from .env
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    sgMail.setApiKey(apiKey);
  }

  /**
   * Core generic method to send any email
   */
  async send(data: ISendEmail): Promise<boolean> {
    const msg = {
      to: data.to,
      from: this.configService.get<string>('MAIL_FROM'), // e.g., 'no-reply@yourdomain.com'
      subject: data.subject,
      text: data.text,
      html: data.html,
      templateId: data.template, // Optional: if using SendGrid Dynamic Templates
      dynamicTemplateData: data.context,
    };

    // common/email/email.service.ts
try {
  await sgMail.send(msg);
  return true;
} catch (error) {
  // Add this to see the EXACT reason from SendGrid (e.g., "Sender not verified")
  if (error.response) {
    console.error('SendGrid Error Body:', JSON.stringify(error.response.body, null, 2));
  }
  this.logger.error(`Failed to send email to ${data.to}`, error.stack);
  throw new InternalServerErrorException('Email delivery failed');
}
  }
}