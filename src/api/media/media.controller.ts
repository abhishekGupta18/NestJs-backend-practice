import { Controller, Post, UseInterceptors, UploadedFile, Body, Get, Param } from '@nestjs/common';
import { MediaService } from './media.service';
import { DirectUploadBodyDto, ConfirmUploadApiResponseDto, GetMediaApiResponseDto } from './dto/media.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiDirectUpload, ApiGetMedia } from './swagger/media.swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  /**
   * Advanced file upload route.
   * Receives a file and metadata, validates types, and returns a signed access URL.
   */
  @ApiDirectUpload()
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async directUpload(
    @Body() dto: DirectUploadBodyDto,
    @UploadedFile() file: any,
  ): Promise<ConfirmUploadApiResponseDto> {
    const data = await this.mediaService.directUpload(dto, file);
    return {
      status: 'success',
      message: 'File uploaded and validated successfully',
      data,
    };
  }

  /**
   * Retrieval route.
   * Returns media details and a fresh signed access URL.
   */
  @ApiGetMedia()
  @Get(':id')
  async getMedia(@Param('id') id: string): Promise<GetMediaApiResponseDto> {
    const data = await this.mediaService.getMediaById(id);
    return {
      status: 'success',
      message: 'Media retrieved successfully',
      data,
    };
  }
}