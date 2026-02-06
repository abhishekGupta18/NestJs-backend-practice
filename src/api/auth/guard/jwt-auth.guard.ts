// src/auth/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// By passing 'jwt' to AuthGuard, we tell it to use the JwtStrategy
// you defined (since you named it by extending PassportStrategy(Strategy)).
export class JwtAuthGuard extends AuthGuard('jwt') { }