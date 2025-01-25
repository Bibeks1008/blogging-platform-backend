import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostimageService {
  constructor(private prisma: PrismaService) {}

  async uploadPostImage(postId: number, file: Express.Multer.File) {
    const fileType = file.mimetype.split('/')[1];
    console.log(file.filename);
    const imageDetail = await this.prisma.postImage.create({
      data: {
        imageUrl: file.filename,
        fileType: fileType,
        postId: postId,
      },
    });
    return {
      message: 'Image uploaded successfully',
      imageUrl: imageDetail.imageUrl,
    };
  }
}
