import { DBService } from '@db/db.service';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OtpDbService } from './otp/otp-db.service';
import { OtpDbRepository } from './otp/otp-db.repository';
import { AuthDbRepository } from './auth/auth-db.repository';
import { AuthDbService } from './auth/auth-db.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [DBService, OtpDbService,OtpDbRepository,AuthDbRepository,AuthDbService],
  exports: [DBService, OtpDbService,AuthDbService],
})
export class DBModule {}
