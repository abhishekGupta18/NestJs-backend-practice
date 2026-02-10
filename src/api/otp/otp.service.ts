import { OtpDbService } from "@db/otp/otp-db.service";
import { EmailQueue } from "@bg/queue/email/email.queue";
import { Injectable, InternalServerErrorException } from "@nestjs/common";

@Injectable()
export class OtpService{
    constructor(
        private readonly otpDbService:OtpDbService,
        private readonly emailQueue: EmailQueue
    ){}

    async sendOtp(email:string):Promise<string>{


        if(!email){
            throw new Error("Email is required");
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const saveOtp = await this.otpDbService.saveOtp(email,otp);
        if(!saveOtp){
            throw new Error("Failed to save otp");
        }  
        
        // Add job to email queue
        try {
            await this.emailQueue.addOTPEmailJob({
                email: email,
                otp: parseInt(otp)
            });
        } catch (error) {
            console.error("Failed to queue OTP email", error);
            throw new InternalServerErrorException("Failed to queue OTP email");
        }

         
        return otp;
    }

    async verifyOtp(email:string,otp:string):Promise<boolean>{
        if(!email || !otp){
            throw new Error("Email and otp are required");
        }
        return this.otpDbService.verifyOtp(email,otp);
    }
    async resendOtp(email:string):Promise<string>{
        if(!email){
            throw new Error("Email is required");
        }
        return this.otpDbService.resendOtp(email);
    }
}