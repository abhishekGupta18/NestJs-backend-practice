import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDbService } from '@db/auth/auth-db.service';
import { AuthDbRepository } from '@db/auth/auth-db.repository';

import { DBModule } from '@db/db.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    DBModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthDbService, AuthDbRepository],
  exports: [AuthService],
})
export class AuthModule {}
