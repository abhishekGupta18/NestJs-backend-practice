import { DBService } from '@db/db.service';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OtpDbService } from './otp/otp-db.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [DBService, OtpDbService],
  exports: [DBService, OtpDbService],
})
export class DBModule {}
