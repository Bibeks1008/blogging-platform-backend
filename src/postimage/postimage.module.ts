import { Module } from '@nestjs/common';
import { PostimageController } from './postimage.controller';
import { PostimageService } from './postimage.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [PostimageController],
  providers: [PostimageService],
})
export class PostimageModule {}
