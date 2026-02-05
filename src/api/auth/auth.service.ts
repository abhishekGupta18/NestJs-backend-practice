import { AuthDbService } from "@db/auth/auth-db.service";
import { ConflictException, Injectable } from "@nestjs/common";
import { UserSignUpDto, UserSignUpResponseDto } from "./dto/auth.dto";
import { OtpService } from "api/otp/otp.service";
import { VerifyOtpDto, ResendOtpDto, OtpSentResponseDto, ResendOtpResponseDto } from "./dto/verify-otp.dto";

@Injectable()
export class AuthService {
    constructor(private readonly authDbService:AuthDbService, private otpService:OtpService) {}

    async signUpUser(signUpDto:UserSignUpDto):Promise<OtpSentResponseDto>{
        const {email} = signUpDto;
        const user = await this.authDbService.findUserByEmail(email);
       
        if(user){
            throw new ConflictException("User already exists");
        }
        
        const otp = await this.otpService.sendOtp(email);

        return {
            status: "success",
            message: "Otp sent successfully",
        };
    }

    async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<UserSignUpResponseDto> {
        const { email, otp } = verifyOtpDto;
        const isValid = await this.otpService.verifyOtp(email, otp);

        if (!isValid) {
            throw new ConflictException("Invalid or expired OTP");
        }

        // OTP is valid, register the user
        const newUser = await this.authDbService.createUser(verifyOtpDto);
        
        return {
            id: newUser.id,
           first_name: newUser.first_name,
           last_name: newUser.last_name,
           email: newUser.email,
           role: newUser.role,
           
           
        };
    }

    async resendOtp(resendOtpDto: ResendOtpDto): Promise<ResendOtpResponseDto> {
        const { email } = resendOtpDto;
        const user = await this.authDbService.findUserByEmail(email);
        
        if (user) {
             throw new ConflictException("User already exists");
        }

        await this.otpService.sendOtp(email);

        return {
            status: "success",
            message: "Otp resent successfully",
        };
    }
}