import { OtpService } from "./otp.service";
import { Module } from "@nestjs/common";
import { Global } from "@nestjs/common";
import { EmailQueueModule } from "@bg/queue/email/email-queue.module";

@Global()
@Module({
    imports: [EmailQueueModule],
    providers: [OtpService],
    exports: [OtpService]
})
export class OtpModule { }
