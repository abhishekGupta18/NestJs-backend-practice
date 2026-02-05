import { OtpDbService } from "@db/otp/otp-db.service";
import { EmailService } from "../../common/email/email.service";
import { Injectable, InternalServerErrorException } from "@nestjs/common";

@Injectable()
export class OtpService{
    constructor(
        private readonly otpDbService:OtpDbService,
        private readonly emailService: EmailService
    ){}

    async sendOtp(email:string):Promise<string>{
        if(!email){
            throw new Error("Email is required");
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Send email
        try {
            await this.emailService.send({
                to: email,
                subject: 'Your OTP Code',
                text: `Your OTP is ${otp}`,
                html: `<p>Your OTP code is: <strong>${otp}</strong></p>`
            });
        } catch (error) {
            console.error("Failed to send OTP email", error);
            throw new InternalServerErrorException("Failed to send OTP email");
        }

        const saveOtp = await this.otpDbService.saveOtp(email,otp);
        if(!saveOtp){
            throw new Error("Failed to save otp");
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