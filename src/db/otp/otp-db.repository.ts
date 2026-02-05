import { DBService } from "@db/db.service";
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";


@Injectable()
export class OtpDbRepository {
    
    constructor (private readonly db:DBService){}

    async saveOtp(email:string,otp:string):Promise<boolean>{
        const EXPIRE_TIME = 5 * 60 * 1000;
        const expireAt = new Date(Date.now() + EXPIRE_TIME)
        try{
            await this.db.otp_codes.create({data:{email,otp_code:otp,expires_at:expireAt}})
        }catch(e){
            throw new Error("Failed to save otp: " + e)
        }   

        return true;
    }

    async verifyOtp(email:string,otp:string):Promise<boolean>{
        try{
            const otpCode = await this.db.otp_codes.findUnique({where:{email}})
            if(!otpCode){
                throw new NotFoundException("Otp not found")
            }
            if(otpCode.expires_at < new Date()){
                await this.db.otp_codes.delete({where:{email}})
                throw new BadRequestException("Otp expired")
            }
            if(otpCode.otp_code !== otp){
                throw new UnauthorizedException("Invalid otp")
            }
            if(otpCode.otp_code == otp){
                await this.db.otp_codes.delete({where:{email}})
            }
            return true
        }catch(e){
            throw new Error("Failed to verify otp: " + e)
        }           
    }

    async resendOtp(email:string):Promise<string>{
        try{
            const otpCode = await this.db.otp_codes.findUnique({where:{email}})
            if(!otpCode){
                throw new NotFoundException("Otp not found")
            }
            if(otpCode.expires_at < new Date()){
                await this.db.otp_codes.delete({where:{email}})
                throw new BadRequestException("Otp expired")
            }
            return otpCode.otp_code
        }catch(e){
            throw new Error("Failed to resend otp: " + e)
        }           
    }

}