// src/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { getEnv } from '@common/getEnv';

// Define the shape of the data expected in the JWT payload
// This is the data you included when generating the Access Token
export interface JwtPayload {
    userId: string; // Corresponds to the 'sub' or user ID you embedded
    email: string; // Other non-sensitive user data
    role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        // This is the configuration for the strategy
        super({
            // 1. Where to extract the JWT from the request
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => {
                    let token = null;
                    if (req && req.cookies) {
                        token = req.cookies['accessToken'];
                    }
                    return token;
                },
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),

            // 2. Secret key used to sign the token (must match the one used during login)
            secretOrKey: getEnv('JWT_ACCESS_SECRET'),

            // 3. This option tells passport to handle token expiration validation for us
            ignoreExpiration: false,
        });
    }

    // The 'validate' method runs ONLY IF the token is successfully verified 
    // (i.e., the signature is correct and the token is not expired).
    async validate(payload: JwtPayload) {
        // In a real application, you might do a quick database lookup here
        // to ensure the user still exists and hasn't been banned.
        // E.g., const user = await this.usersService.findOne(payload.userId);
        // If (!user) { throw new UnauthorizedException(); }

        // Best Practice: For a simple access token, just return the payload data.
        // This returned object is what gets assigned to request.user
        // and what your @User() decorator will extract.
        return {
            email: payload.email,
            role: payload.role,
            userId: payload.userId
        };
    }
}