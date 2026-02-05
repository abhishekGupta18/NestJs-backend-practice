import { OtpService } from "./otp.service";
import { Module } from "@nestjs/common";
import { Global } from "@nestjs/common";
import { EmailModule } from "../../common/email/email.module";

@Global()
@Module({
    imports: [EmailModule],
    providers: [OtpService],
    exports: [OtpService]
})
export class OtpModule { }
