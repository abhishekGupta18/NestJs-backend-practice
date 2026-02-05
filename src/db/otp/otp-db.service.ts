import { OtpDbRepository } from "./otp-db.repository";

export class OtpDbService{
    constructor(private readonly otpDbRepository:OtpDbRepository){}

    async saveOtp(email:string,otp:string):Promise<boolean>{
        return this.otpDbRepository.saveOtp(email,otp)
    }

    async verifyOtp(email:string,otp:string):Promise<boolean>{
        return this.otpDbRepository.verifyOtp(email,otp)
    }

    async resendOtp(email:string):Promise<string>{
        return this.otpDbRepository.resendOtp(email)
    }
}