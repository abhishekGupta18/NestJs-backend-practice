
import { getEnv } from '@common/getEnv';
import { JwtService } from '@nestjs/jwt';


export async function generateTokens( user: { id: string; email: string; role: string }) {
    const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };

    const jwtService = new JwtService();
    const accessToken = await jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: getEnv("JWT_ACCESS_SECRET"),
    });

    const refreshToken = await jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: getEnv("JWT_REFRESH_SECRET"),
    });

    return {
        accessToken,
        refreshToken,
    };
}
