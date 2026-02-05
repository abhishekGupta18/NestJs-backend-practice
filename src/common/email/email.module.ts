// common/email/email.module.ts
import { Module, Global } from '@nestjs/common';
import { EmailService } from './email.service';
import { DBModule } from '@db/db.module';

@Global()
@Module({
  imports: [DBModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}