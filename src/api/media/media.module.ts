import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { S3Provider } from './provider/s3.provider';

@Module({
  imports: [ConfigModule],
  controllers: [MediaController],
  providers: [MediaService, S3Provider],
  exports: [MediaService],
})
export class MediaModule {}