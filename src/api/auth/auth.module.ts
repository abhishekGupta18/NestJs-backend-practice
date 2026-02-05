import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDbService } from '@db/auth/auth-db.service';
import { AuthDbRepository } from '@db/auth/auth-db.repository';

import { DBModule } from '@db/db.module';

@Module({
  imports: [DBModule],
  controllers: [AuthController],
  providers: [AuthService, AuthDbService, AuthDbRepository],
  exports: [AuthService],
})
export class AuthModule {}
