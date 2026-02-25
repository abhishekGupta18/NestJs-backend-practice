import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { OtpSentResponseDto, ResendOtpResponseDto } from "../dto/verify-otp.dto";
import { UserLoginApiResponseDto, UserSignUpApiResponseDto } from "../dto/auth.dto";
import { ApiBadRequestResponse, ApiConflictResponse, ApiInternalServerErrorResponse } from "@common/helpers/swagger.utils";

export function AuthSignup() {
    return applyDecorators(
        ApiOperation({ summary: 'Register a new user (Steps 1: Send OTP)' }),
        ApiResponse({
            status: HttpStatus.CREATED,
            description: 'OTP sent successfully',
            type: OtpSentResponseDto
        }),
        ApiConflictResponse('User already exists'),
        ApiBadRequestResponse(),
        ApiInternalServerErrorResponse()
    );
}

export function AuthVerifyOtp() {
    return applyDecorators(
        ApiOperation({ summary: 'Verify OTP and Register User (Step 2: Verify & Register)' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'User verified and registered successfully',
            type: UserSignUpApiResponseDto
        }),
        ApiConflictResponse('Invalid OTP or User already exists'),
        ApiBadRequestResponse(),
        ApiInternalServerErrorResponse()
    );
}

export function AuthResendOtp() {
    return applyDecorators(
        ApiOperation({ summary: 'Resend OTP' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'OTP resent successfully',
            type: ResendOtpResponseDto
        }),
        ApiConflictResponse('User already exists'),
        ApiBadRequestResponse(),
        ApiInternalServerErrorResponse()
    );
}

export function AuthLogin() {
    return applyDecorators(
        ApiOperation({ summary: 'Login user' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'User logged in successfully',
            type: UserLoginApiResponseDto
        }),
        ApiConflictResponse('User not found'),
        ApiBadRequestResponse(),
        ApiInternalServerErrorResponse()
    );
}

export function AuthLogout() {
    return applyDecorators(
        ApiOperation({ summary: 'Logout user' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'User logged out successfully',
            type: UserLoginApiResponseDto
        }),
        ApiConflictResponse('User not found'),
        ApiBadRequestResponse(),
        ApiInternalServerErrorResponse()
    );
}