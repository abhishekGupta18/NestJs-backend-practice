import { Body, Controller, Get, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserLoginApiResponseDto, UserLoginDto, UserLogoutApiResponseDto, UserSignUpApiResponseDto, UserSignUpDto } from "./dto/auth.dto";
import { VerifyOtpDto, ResendOtpDto, OtpSentResponseDto, ResendOtpResponseDto } from "./dto/verify-otp.dto";
import { ResponseUtil } from "@common/helpers/response.utils";
import { AuthLogin, AuthLogout, AuthResendOtp, AuthSignup, AuthVerifyOtp } from "./swagger/auth.swagger";
import { Response } from "express";
import { JwtAuthGuard } from "./guard/jwt-auth.guard";
import { User } from "./decorator/userDecorator";

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
    async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto, @Res({ passthrough: true }) res: Response): Promise<UserSignUpApiResponseDto> {
        const user = await this.authService.verifyOtp(verifyOtpDto);
       
        // Set access token cookie
        res.cookie('accessToken', user.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        
        // Set refresh token cookie
        res.cookie('refreshToken', user.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        
        return ResponseUtil.success(user, 'User added successfully', HttpStatus.OK);

    }

    @Post('resend-otp')
    @AuthResendOtp()
    async resendOtp(@Body() resendOtpDto: ResendOtpDto): Promise<ResendOtpResponseDto> {
        return this.authService.resendOtp(resendOtpDto);
    }

    @Post('login')
    @AuthLogin()    
    async login(@Body() loginDto: UserLoginDto, @Res({ passthrough: true }) res: Response): Promise<UserLoginApiResponseDto> {
        const user = await this.authService.login(loginDto);
       
        // Set access token cookie
        res.cookie('accessToken', user.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        
        // Set refresh token cookie
        res.cookie('refreshToken', user.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        
        return ResponseUtil.success(user, 'User logged in successfully', HttpStatus.OK);
    }

    @Post('logout')
    @AuthLogout()
    async logout(@Res({ passthrough: true }) res: Response): Promise<UserLogoutApiResponseDto> {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return ResponseUtil.success(null, 'User logged out successfully', HttpStatus.OK);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    async getProfile(@User() user: any) {
        return ResponseUtil.success(user, 'User profile fetched successfully', HttpStatus.OK);
    }
    

}
