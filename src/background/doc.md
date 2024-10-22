# Background Module Documentation

## Overview

The Background Module is designed to handle asynchronous tasks in a NestJS application, allowing you to offload tasks from the main thread. This module utilizes BullMQ for job processing and provides a structured way to manage email-related jobs, including sending OTP emails and handling various queue events.

## Structure

The Background Module consists of several key components:

1. **Modules**:

   - `BackgroundModule`: The main module that imports necessary sub-modules like `EmailQueueModule`, `MediaUploadQueueModule`, and `CronModule`.

2. **Queues**:

   - `EmailQueue`: Responsible for adding email jobs to the queue.
   - `EmailProcessor`: Processes jobs from the email queue, handling different job types such as OTP email verification.

3. **Events**:

   - `EmailQueueEvents`: Listens for events related to the email queue, such as job addition, completion, and failure.

4. **Services**:

   - `EmailQueueService`: Provides methods to send emails, including OTP emails, by interacting with the `EmailService`.

5. **Constants**:

   - `job.constant.ts`: Contains enumerations for job names and queue names, ensuring consistency across the module.

6. **Interfaces**:
   - `job.interface.ts`: Defines the structure of job data, including email job details.

Similarly other background queue modules like `MediaUploadQueueModule`, and `CronModule` are structured.

## Usage

### Setting Up the Background Module

1. **Import the Background Module**:
   Ensure that the `BackgroundModule` is imported into your main application module or any other module where you want to use it.

   ```typescript
   import { Module } from '@nestjs/common';
   import { BackgroundModule } from './background/background.module';

   @Module({
     imports: [BackgroundModule],
   })
   export class AppModule {}
   ```

2. **Adding Jobs to the Queue**:
   You can add jobs to the email queue using the `EmailQueue` service. Here’s an example of how to add an OTP email job:

   ```typescript
   import { Injectable } from '@nestjs/common';
   import { EmailQueue } from './background/queue/email/email.queue';
   import { IOtpEmailJob } from './background/interfaces/job.interface';

   @Injectable()
   export class SomeService {
     constructor(private readonly emailQueue: EmailQueue) {}

     async sendOtp(email: string, customerName: string, otp: number) {
       const jobData: IOtpEmailJob = { email, customerName, otp };
       await this.emailQueue.addOTPEmailJob(jobData);
     }
   }
   ```

### Processing Jobs

The `EmailProcessor` class automatically processes jobs added to the email queue. It handles different job types based on the job name. For example, when an OTP email job is processed, it calls the `sendOtpEmail` method from the `EmailQueueService`.

### Listening to Queue Events

You can listen to various queue events using the `EmailQueueEvents` class. This allows you to log or handle events such as job completion or failure.

### Error Handling

Ensure to implement error handling in your job processing logic. The `EmailProcessor` and `EmailQueueService` classes already include basic error logging.

## Conclusion

The Background Module provides a robust framework for handling asynchronous tasks in your NestJS application. By utilizing queues and processors, you can efficiently offload tasks from the main thread, improving the overall performance and responsiveness of your application.
