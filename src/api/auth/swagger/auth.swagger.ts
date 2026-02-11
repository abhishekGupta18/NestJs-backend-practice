import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { OtpSentResponseDto, ResendOtpResponseDto } from "../dto/verify-otp.dto";
import { UserLoginApiResponseDto, UserSignUpApiResponseDto } from "../dto/auth.dto";

export function AuthSignup() {
    return applyDecorators(
        ApiOperation({ summary: 'Register a new user (Steps 1: Send OTP)' }),
        ApiResponse({
            status: HttpStatus.CREATED,
            description: 'OTP sent successfully',
            type: OtpSentResponseDto
        }),
         ApiResponse({
            status: HttpStatus.CONFLICT,
            description: 'User already exists',
        }),

        ApiResponse({
            status: HttpStatus.BAD_REQUEST,
            description: 'Invalid request',
        }),

        ApiResponse({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            description: 'Internal server error',
        })
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
        ApiResponse({
            status: HttpStatus.CONFLICT,
             description: 'Invalid OTP or User already exists',
        }),

        ApiResponse({
            status: HttpStatus.BAD_REQUEST,
            description: 'Invalid request',
        }),

        ApiResponse({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            description: 'Internal server error',
        })
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
        ApiResponse({
            status: HttpStatus.CONFLICT,
            description: 'User already exists',
            }),

        ApiResponse({
            status: HttpStatus.BAD_REQUEST,
            description: 'Invalid request',
        }),

        ApiResponse({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            description: 'Internal server error',
        })
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
            ApiResponse({
                status: HttpStatus.CONFLICT,
                description: 'User not found',
            }),

            ApiResponse({
                status: HttpStatus.BAD_REQUEST,
                description: 'Invalid request',
            }),

            ApiResponse({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                description: 'Internal server error',
            })

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
                ApiResponse({
                    status: HttpStatus.CONFLICT,
                    description: 'User not found',
                }),

                ApiResponse({
                    status: HttpStatus.BAD_REQUEST,
                    description: 'Invalid request',
                }),

                ApiResponse({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    description: 'Internal server error',
                })

            );
        }   