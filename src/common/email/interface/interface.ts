// common/email/interfaces/email.interface.ts
export interface ISendEmail {
  to: string;
  subject: string;
  template?: string; // If using SendGrid Dynamic Templates
  context?: Record<string, any>; // Data to pass to the template
  text?: string;
  html?: string;
}