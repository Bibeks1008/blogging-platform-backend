import {
  Controller,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PostimageService } from './postimage.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostimageController {
  constructor(private postimageService: PostimageService) {}

  @Post(':postId/images')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        if (
          file.mimetype === 'image/jpeg' ||
          file.mimetype === 'image/png' ||
          file.mimetype === 'image/jpg'
        ) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
    }),
  )
  uploadPostImage(
    @Param('postId', ParseIntPipe) postId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException(
        'Only JPG and PNG files are allowed!',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.postimageService.uploadPostImage(postId, file);
  }
}
