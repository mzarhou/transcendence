import {
  Controller,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import fs from 'fs';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { env } from '@src/+env/server';

@ApiBearerAuth()
@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  @Post('image')
  @ApiOperation({ summary: 'upload image and get its url { imageUrl }' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const path = `./static`;
          fs.mkdirSync(path, { recursive: true });
          return cb(null, path);
        },
        filename(_req, { originalname }, callback) {
          callback(null, Date.now() + '-' + originalname);
        },
      }),
    }),
  )
  uploadFiles(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(png|jpg|jpeg)/,
        })
        .addMaxSizeValidator({
          maxSize: 1048576, // 1MB
        })
        .build(),
    )
    file: Express.Multer.File,
  ) {
    return {
      imageUrl: env.BACKEND_URL + '/static/' + file.filename,
    };
  }
}
