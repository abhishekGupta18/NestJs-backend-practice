import { Body, Controller, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserSignUpApiResponseDto, UserSignUpDto } from "./dto/auth.dto";
import { VerifyOtpDto, ResendOtpDto, OtpSentResponseDto, ResendOtpResponseDto } from "./dto/verify-otp.dto";
import { ResponseUtil } from "@common/helpers/response.utils";
import { AuthResendOtp, AuthSignup, AuthVerifyOtp } from "./swagger/auth.swagger";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    @AuthSignup()
    async signUpUser(@Body() signUpDto: UserSignUpDto): Promise<OtpSentResponseDto> {
        return this.authService.signUpUser(signUpDto);
    }

    @Post('verify-otp')
    @AuthVerifyOtp()
    async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<UserSignUpApiResponseDto> {
        const user = await this.authService.verifyOtp(verifyOtpDto);

        return ResponseUtil.success(user, 'User added successfully', HttpStatus.OK);

    }

    @Post('resend-otp')
    @AuthResendOtp()
    async resendOtp(@Body() resendOtpDto: ResendOtpDto): Promise<ResendOtpResponseDto> {
        return this.authService.resendOtp(resendOtpDto);
    }
}
