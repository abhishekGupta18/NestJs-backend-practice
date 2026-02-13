import { Controller, Post, Body, Param, Get, UseInterceptors, UploadedFile } from '@nestjs/common';
import { MediaService } from './media.service';
import { GeneratePresignedUrlBodyDto, MediaFileEntityType, MediaFileType, MediaAccessLevel, GeneratePresignedUrlApiResponseDto, ConfirmUploadApiResponseDto } from './dto/media.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiGeneratePresignedUrl, ApiConfirmUpload, ApiGetAccessUrl } from './swagger/media.swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @ApiGeneratePresignedUrl()
  @Post(':entityType/:entityId/:fileType/:accessLevel/presigned-url')
  @UseInterceptors(FileInterceptor('file'))
  async getPresignedUrl(
    @Param('entityType') entityType: MediaFileEntityType,
    @Param('entityId') entityId: string,
    @Param('fileType') fileType: MediaFileType,
    @Param('accessLevel') accessLevel: MediaAccessLevel,
    @Body() dto: GeneratePresignedUrlBodyDto,
    @UploadedFile() file?: any,
  ): Promise<GeneratePresignedUrlApiResponseDto> {
    const data = await this.mediaService.generatePresignedUrl(
      dto,
      entityId,
      entityType,
      fileType,
      accessLevel,
      file,
    );
    return {
      status: 'success',
      message: 'Presigned URL generated successfully',
      data,
    };
  }

  @ApiConfirmUpload()
  @Post(':id/confirm')
  async confirmUpload(@Param('id') id: string): Promise<ConfirmUploadApiResponseDto> {
    const data = await this.mediaService.confirmUpload(id);
    return {
      status: 'success',
      message: 'Upload confirmed successfully',
      data,
    };
  }

  @ApiGetAccessUrl()
  @Get(':id/access')
  async getAccessUrl(@Param('id') id: string) {
    const url = await this.mediaService.getAccessUrl(id);
    return {
      status: 'success',
      message: 'Access URL generated successfully',
      data: { url },
    };
  }
}