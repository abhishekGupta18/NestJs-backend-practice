import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDbService } from '@db/auth/auth-db.service';
import { AuthDbRepository } from '@db/auth/auth-db.repository';

import { DBModule } from '@db/db.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PermissionsGuard } from './guard/permissions.guard';

@Module({
  imports: [
    DBModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthDbService, AuthDbRepository, JwtStrategy, PermissionsGuard],
  exports: [AuthService],
})
export class AuthModule {}
