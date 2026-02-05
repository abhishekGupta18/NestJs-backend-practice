import { ApiProperty } from "@nestjs/swagger";
import { ApiResponse } from "@common/dto/api-response";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { UserSignUpDto } from "./auth.dto";

export class VerifyOtpDto extends UserSignUpDto {
    @ApiProperty({example: "123456", description: "6-digit OTP code"})
    @IsString()
    @IsNotEmpty()
    @Length(6, 6)
    otp: string;
}

export class ResendOtpDto {
    @ApiProperty({example: "user@example.com"})
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class OtpSentResponseDto{
    @ApiProperty({example: "Otp sent successfully"})
    message?: string;

    @ApiProperty({example: "success"})
    status?:string;

    @ApiProperty({example: "123456", description: "6-digit OTP code"})
    otp?:string; /// returning otp for testing purpose only 
}
export class ResendOtpResponseDto  {
     @ApiProperty({example: "Otp sent successfully"})
    message?: string;

    @ApiProperty({example: "success"})
    status?:string;
     
}
