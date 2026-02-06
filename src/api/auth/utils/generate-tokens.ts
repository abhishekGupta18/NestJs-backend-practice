
import { JwtService } from '@nestjs/jwt';


export async function generateTokens(jwtService: JwtService, user: { id: string; email: string; role: string }) {
    const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };

    const accessToken = await jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: process.env.JWT_ACCESS_SECRET,
    });

    const refreshToken = await jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET,
    });

    return {
        accessToken,
        refreshToken,
    };
}
