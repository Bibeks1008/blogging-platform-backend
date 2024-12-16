import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddCommentDto } from './dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async addCommentToPost(userId: number, postId: number, dto: AddCommentDto) {
    const comment = await this.prisma.comments.create({
      data: { postId: postId, authorId: userId, ...dto },
    });

    return {
      message: 'Comment added successfully',
      comment: { id: comment.id, content: comment.content },
    };
  }

  async getAllCommentsOfPost(userId: number, postId: number) {
    const comments = await this.prisma.comments.findMany({
      where: {
        authorId: userId,
        postId: postId,
      },
    });

    return comments;
  }
}
